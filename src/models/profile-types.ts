export type Profile = {
	id: number;
	cscId: number;
	discordId: string;
	discordName: string;
	name: string;
	profileJson: string;
	createdAt: string;
	updatedAt: string;
};

export type ProfileJson = {
	age: string;
	bio: string;
	isIGL: boolean;
	iglExperience: string;
	region: string;
	aspectRatio: string;
	dpi: number;
	inGameSensitivity: string;
	favoriteWeapon: string;
	favoriteRole: string;
	favoriteMap: string;
	favoriteProPlayer: string;
	favoriteProTeam: string;
	preferredRoles: string;
	socials: Record<string, string>;
	firstCSCSeason: number;
	whatExperienceDoYouWant: string;
}
