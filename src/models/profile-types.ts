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
	isIGL: boolean;
	twitchUsername: string;
	favoriteWeapon: string;
	favoriteRole: string;
	favoriteMap: string;
	youtubeChannel: string;
	preferredRoles: string;
}
