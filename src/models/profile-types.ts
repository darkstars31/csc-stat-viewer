import { SingleValue } from "react-select";

export type Profile = {
    discordId: string;
    discordUsername: string;
    isIGL: boolean,
    twitch_username: string,
    favorite_weapon: string,
    favorite_role: string,
    favorite_map: string,//SingleValue<{ label: string, value: string }>,
    youtube_channel: string,
    preferred_roles: string,
    updated_at: string,
    created_at: string,
}