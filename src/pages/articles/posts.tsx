import * as React from "react";
import { Container } from "../../common/components/container";
import { useFetchArticles } from "../../dao/analytikill";
import { Loading } from "../../common/components/loading";
import { Link } from "wouter";
import { Card } from "../../common/components/card";
import { useDataContext } from "../../DataContext";
import dayjs from "dayjs";

export type Post = {
	id: number;
	title: string;
	subtitle: string | null;
	bannerURL: string;
	tags: string[];
	content: string;
	anonymous: boolean;
	approvalState: string;
	approvedBy: string;
	metadata: any | null;
	discordId: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
  }

export const PostLink = ({ post }: { post: Post}) => {
	const { players } = useDataContext();
	const author = players.find( (player) => player.discordId === post?.discordId)?.name ?? "Anonymous";
    const date = dayjs(post?.createdAt).format("MMMM D, YYYY");
	
	return (
		<div className="basis-4/12">
			<Link to={`/articles/${post.id}`}>
				<Card style={{ backgroundImage: `url(${post?.bannerURL})`}} className={`bg-[url('${post.bannerURL}')]`}>		
					<div className="m-2 p-2 text-3xl font-extrabold uppercase text-center">{post.title}</div>
					{post.subtitle}
					<div className="text-xs text-gray-500">
						{date} - {author}
					</div>		
				</Card>
			</Link>
		</div>
	);
}

export const Posts = () => {
	const { discordUser } = useDataContext();
	const { data: posts, isLoading } = useFetchArticles();

	return (
		<Container>
			<div className="mx-auto max-w-lg text-center m-4 p-2">
				<h2 className="text-3xl font-bold sm:text-4xl">Articles</h2>
			</div>
			<div className="flex flex-row justify-end">
				{ discordUser && <div>
					<Link className="text-blue-500" to="/articles/create">Create a Post</Link>
				</div> }
			</div>
			{ isLoading && <Loading /> }
			<div className="flex flex-row flex-wrap gap-6">
				<div className="basis-1/4 grow">
					{ posts?.map( (post: Post) => <PostLink post={post} /> ).splice(0, 10) }
				</div>
				<div className="basis-1/3">
					Article History
					<div>

					</div>
				</div>
			</div>
		</Container>
	);
};
