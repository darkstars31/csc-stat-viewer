import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";

export function AppLoadingError() {
	const { errors } = useDataContext();

	if (errors.length === 0) {
		return null;
	}

	console.info("errors", errors);

	return (
		<Container>
			<div className="mx-auto p-4 text-xl">
				An Error has occured! Either the CSC endpoints are not responding or something changed and will need to
				be fixed.
				<div className="text-center text-m pt-4">Please contact Camps to report this issue.</div>
			</div>
		</Container>
	);
}
