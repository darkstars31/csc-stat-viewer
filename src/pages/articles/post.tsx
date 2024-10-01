import * as React from "react";
import { Link, useRoute } from "wouter";
import { useFetchArticle } from "../../dao/analytikill";
import { Loading } from "../../common/components/loading";
import { Container } from "../../common/components/container";
import dayjs from "dayjs";

import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDataContext } from "../../DataContext";
import { IoArrowBack } from "react-icons/io5";


export function Post() {
    const { players } = useDataContext();
    const [, params] = useRoute("/article/:id");
    const { data, isLoading } = useFetchArticle(params?.id ?? "");
    const post = data?.at(0)

    const author = players.find( (player) => player.discordId === post?.discordId)?.name ?? "Anonymous";
    const date = dayjs(post?.createdAt).format("MMMM D, YYYY");

    return (
        <Container>
            { isLoading && <Loading /> }
            { post && 
                <div>
                    <div className="flex flex-row justify-between">
                        <Link to="/articles"><IoArrowBack className="inline" /> Back</Link>
                    </div>
                    <div style={{ backgroundImage: `url(${post?.bannerURL})`}} className={`rounded bg-[url('${post?.bannerURL}')]`}>
                        <div className="flex flex-col m-2 p-2">
                            <div className="text-3xl text-extrabold uppercase">
                                {post.title}
                            </div>
                            { post?.subtitle && <div className="px-4 pt-1 text-gray-400">
                                {post?.subtitle}
                            </div> }
                            <div className="px-4 pt-2 text-gray-400">
                                {date} - {author}
                            </div>
                            <div className="pl-2 text-xs">
                                Tags: { post.tags && post.tags.map( (tag: string) => `#${tag} `).join(", ") }
                            </div>
                        </div>
                    </div>
                    <div className="px-2">
                        <EditorProvider content={post.content} extensions={[StarterKit]} editable={false}>
                        </EditorProvider>
                    </div>
                </div>
            }
        </Container>
    )
}   