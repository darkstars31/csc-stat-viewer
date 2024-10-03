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

type approvalState = "APPROVED" | "PENDING" | "REJECTED";

export function Admin(){

    const { players } = useDataContext();
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
            queryClient.invalidateQueries(["Posts"])
        })
    }

    if (!isUserInScope("admin")) {
        return (
            <Container>
                You are not authorized to view this page
            </Container>
        )
    }

    return (
        <Container>
            <div className="flex flex-row">
                <div className="basis-1/3">
                    <div>
                        Articles Under Review
                    </div>
                    <div>
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
                    </div>
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