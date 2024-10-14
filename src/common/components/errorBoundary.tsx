import * as React from "react";
import { Container } from "./container";
import * as Sentry from "@sentry/browser";

export class ErrorBoundary extends React.Component {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { error: null, url: window.location.href };
	}

	static getDerivedStateFromError(error: any) {
		return { error };
	}

	render() {
		// @ts-ignore
		const { error } = this.state;
		// @ts-ignore
		if (this.state.error && this.state.url === window.location.href) {
			Sentry.captureException(error);
			return (
				<Container>
					<div className="text-center">
						<h2 className="text-2xl">Uh oh! It looks like an error has occured!</h2>
						<p>Description: {error.toString()}</p>
						<div>This issue has been captured and sent to Camps for investigation.</div>
						<img
							className="rounded mx-auto flex items-center justify-center"
							src="http://placekitten.com/200/300"
							alt=""
						/>
						In the mean time, here's a picture of a cat to say I'm sorry.	
					</div>
				</Container>
			);
		}
		// @ts-ignore
		return this.props.children;
	}
}
