
export function getSteamApiPlayerSummeries( steamIds: string[] ) {
    const steamApiKey = "";
    return fetch(` http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(",")}`)
    .then( response => response.json() );
}