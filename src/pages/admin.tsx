import * as React from "react";
import { Container } from "../common/components/container";
import { useFetchArticles } from "../dao/analytikill";
import { isUserInScope } from "../common/utils/user-utils";
import { Link } from "wouter";
import dayjs from "dayjs"
import { useDataContext } from "../DataContext";
import { analytikillHttpClient } from "../dao/httpClients";
import { queryClient } from "../App";

type approvalState = "APPROVED" | "PENDING" | "REJECTED";

export function Admin(){

    const { players } = useDataContext();
    const { data: posts = [], isLoading: isLoadingPosts } = useFetchArticles();

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
            </div>
        </Container>
    );
}