import * as React from "react";
import { useRoute } from "wouter";
import { useFetchArticle } from "../../dao/analytikill";
import { Loading } from "../../common/components/loading";



export function Post() {
    const [, params] = useRoute("/article/:id");
    const { data: post, isLoading } = useFetchArticle(params?.id ?? "");
    return (
        <div>
            { isLoading && <Loading /> }
            { post && <div>{post.title}</div> }
        </div>
    )
}   