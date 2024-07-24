export type FaceitApiResponse = {
	data: FaceitApiTypes;
};

export type FaceitApiTypes = {
	games: {
		csgo: {
			skill_level: number;
		};
	};
};
