import * as React from "react";
import { Route, Router, useLocation, useRouter } from "wouter";
import { Posts } from "./posts";
import { CreatePost } from "./create";

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
		{ path: `/create`, component: () => <CreatePost /> },
	];

	return (
		<Router base={nestedBase} key={nestedBase}>
			{routes.map(route => (
				<Route key={`route${route.path}`} {...route} />
			))}
		</Router>
	);
};
