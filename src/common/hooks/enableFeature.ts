import * as React from "react";
import { useDataContext } from "../../DataContext";
import { get } from "lodash";

const isIn = (obj?: Record<string, any>, evaluate?: string, array?: string | string[]) =>
	(Array.isArray(array) ? array : [array]).map(i => atob(i ?? "")).includes(get(obj, evaluate ?? "") || "");

export const useEnableFeature = (featureString: string) => {
	const [enabled, setEnabled] = React.useState(false);
	const { loggedinUser } = useDataContext();

	React.useEffect(() => {
		const rules = [
			{
				name: "canRequestServers",
				function: () =>
					isIn(loggedinUser, "team.franchise.prefix", [
						"V0VU",
						"RlJH",
						"U0FW",
						"ZEI=",
						"SEc=",
						"TkFO",
						"QUNB",
					]) ||
					isIn(loggedinUser, "steam64Id", [
						"NzY1NjExOTgxNjk5MzM4Nzg=",
						"NzY1NjExOTc5ODcwMTU0NjA=",
						"NzY1NjExOTgxMDcxNTY4MjA=",
						"NzY1NjExOTc5ODcwMTU0NTg=",
						"NzY1NjExOTgwODczMzMyOTY=",
						"NzY1NjExOTgzODA3ODg0NDU=",
						"NzY1NjExOTgxOTA0OTAzNTA=",
						"NzY1NjExOTgxNzQ4NDM0NzA=",
					]),
			},
		];

		const rule = rules.find(r => r.name === featureString);
		if (rule) {
			setEnabled(rule.function());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return enabled;
};
