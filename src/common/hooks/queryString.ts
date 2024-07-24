import * as React from "react";

export const useQueryString = (key: string, value: string) => {
	React.useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set(key, value);
		window.history.pushState(null, "", url);
	}, [key, value]);
};
