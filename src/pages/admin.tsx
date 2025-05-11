import * as React from "react";
import { Container } from "../common/components/container";
import { useFetchArticles } from "../dao/analytikill";
import { isUserInScope } from "../common/utils/user-utils";
import { Link } from "wouter";
import dayjs from "dayjs"
import { useDataContext } from "../DataContext";
import { analytikillHttpClient } from "../dao/httpClients";
import { queryClient } from "../App";
import { Input } from "../common/components/forms/input";
import { Button } from "../common/components/button";
import papa from "papaparse";

type approvalState = "APPROVED" | "PENDING" | "REJECTED";

export function Admin(){
    const [ hasUploadedGmRTLCsv, setHasUploadedGmRTLCsv ] = React.useState<boolean>(false);
    const { players, gmRTLCsv, setGmRTLCsv } = useDataContext();
    const { data: posts = [], isLoading: isLoadingPosts } = useFetchArticles();
    const [ customServerNotice, setCustomServerNotice ] = React.useState<string>();

    const updateServerNotice = ( type: string, message: string) => {
        analytikillHttpClient.post(`/servers/notice`, {
            notice: { 
                type,
                message: customServerNotice ? customServerNotice : message
            }
        })
    }

    const updatePost = (id: number, action: approvalState) => {
        analytikillHttpClient.patch(`/analytikill/article/${id}`,
            {
                approvalState: action
            }
        ).then( () => {
            queryClient.invalidateQueries({ queryKey:["Posts"]})
        })
    }

    if (!isUserInScope("admin")) {
        return (
            <Container>
                You are not authorized to view this page
            </Container>
        )
    }

    const onHandleGmRTLCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvContent = event.target?.result;
                if (csvContent) {
                    papa.parse(csvContent as string, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (result) => {
                            if (result.data.map((item) => {
                                if (typeof item === "object" && item !== null && "MMR" in item && "CSC ID" in item) {
                                    return true;
                                }
                                return false;
                            })) {
                                console.log("CSV parsed successfully");
                                setGmRTLCsv(result.data as Record<string, string>[]);
                                setHasUploadedGmRTLCsv(true);
                            } else {
                                console.error("CSV is missing required columns: MMR and CSC ID");
                            }
                        },
                        error: (error: any) => {
                            console.error("Error parsing CSV:", error);
                        },
                    });
                }
            };
            reader.readAsText(file);
        }
    }
    
    return (
        <Container>
            <div className="flex flex-row">
                <div className="basis-1/3 space-y-3">
                    <div className="text-center">Upload CSV File</div>
                    <p>GM RTL {gmRTLCsv?.length}</p>
                    { !gmRTLCsv ? 
                        <div className="w-full rounded-lg border border-gray-500 p-4 text-center h-24"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            onHandleGmRTLCsv({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                    >
                        Drag and drop your CSV file here, or click to select a file.
                        <Input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={onHandleGmRTLCsv}
                        />
                    </div>
                    :
                    <div>
                        <div className="text-center">GM RTL CSV Uploaded</div>           
                        <div className="w-full rounded-lg border border-gray-500 p-4 text-center">
                            CSV file has been uploaded successfully.
                            <div className="bg-yellow-400 text-black p-1 m-1 rounded">
                               Warning. Please be careful not to expose MMR to the public.
                            </div>
                            <br />
                            <button className="rounded bg-red-500 h-6 m-1 p-1" onClick={ () => setGmRTLCsv(null)}>Remove</button>
                        </div>
                    </div>
                    }
                </div>
                <div className="basis-1/3">
                    Articles Under Review
                    <>
                        { posts?.filter( p => p.approvalState === "Pending").map((post) => (
                            <div style={{ backgroundImage: `url(${post?.bannerURL})`}} className=" flex flex-row justify-between h-16 m-2 p-1 border border-gray-500 rounded">
                                <Link to={`/articles/${post.id}`}>
                                    <div className="">{post.title}</div>
                                    <div className="text-xs">{post.subtitle}</div>
                                    <div className="text-xs">{dayjs(post.createdAt).format("MMMM DD, YYYY")} - {players.find(p => p.discordId === post.discordId)?.name ?? "Unknown"}</div>
                                </Link>
                                <div className="flex flex-row text-xs">
                                    <button className="rounded bg-green-500 h-6 m-0.5 p-0.5" onClick={ () => updatePost(post.id, "APPROVED")}>Approve</button>
                                    <button className="rounded bg-red-500 h-6 m-0.5 p-0.5" onClick={ () => updatePost(post.id, "REJECTED")}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </>
                </div>
                <div className="basis-1/3 space-y-3">
                    <div className="text-center">Server Notices</div>
                    <Button className="w-full rounded bg-green-600 hover:bg-green-500 m-1 p-2" 
                        onClick={ () => updateServerNotice("", "")}>
                            Servers are Healthy
                        </Button>
                    <hr className="bg-gray-500 text-gray-500 rounded-lg" />
                    <Button className="w-full rounded bg-red-600 hover:bg-red-500 m-1 p-2" 
                        onClick={ () => updateServerNotice("alert", "Servers may be unstable or non-functional.")}>
                            Something is Wrong with the Servers
                        </Button>
                    <Input
                        className={`w-full grow rounded-lg border-none bg-white/5 text-white`}
                        placeholder="Custom Notice Message..."
                        onChange={ e => setCustomServerNotice( e.currentTarget.value)}
                    />
                </div>
            </div>
        </Container>
    );
}