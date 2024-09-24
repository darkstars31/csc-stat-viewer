import * as React from "react";
import { Container } from "../../common/components/container";
import { useFetchArticles } from "../../dao/analytikill";
import { Loading } from "../../common/components/loading";

export const Posts = () => {
	const { data: posts, isLoading } = useFetchArticles();

	return (
		<Container>
			<div>Posts</div>
			{ isLoading && <Loading /> }
			<div>
				{ posts?.map( (post: any) => <div key={post.id}>{post.title}</div> ) }
			</div>
		</Container>
	);
};
