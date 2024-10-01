import * as React from "react";
import { Route, Router, useLocation, useRouter } from "wouter";
import { Posts } from "./posts";
import { CreatePost } from "./create";
import { Submitted } from "./submitted";
import { Post } from "./post";

type Props = {
	base: string;
};

export const ArticleRoutes = (props: Props) => {
	const router = useRouter();
	const [parentLocation] = useLocation();

	const nestedBase = `${router.base}${props.base}`;
	if (!parentLocation.startsWith(nestedBase)) return null;

	const routes = [
		{ path: `/`, component: () => <Posts /> },
		{ path: `/:id`, component: () => <Post /> },
		{ path: `/create`, component: () => <CreatePost /> },
		{ path: `/submitted`, component: () => <Submitted /> },
	];

	return (
		<Route key={nestedBase}>
			{routes.map(route => (
				<Route key={`${nestedBase}/route${route.path}`} path={`${nestedBase}/${route.path}`} component={route.component} />
			))}
		</Route>
	);
};
