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
						<div>This issue has been captured for investigation.</div>	
					</div>
				</Container>
			);
		}
		// @ts-ignore
		return this.props.children;
	}
}
