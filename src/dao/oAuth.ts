import cookie from 'js-cookie';

export const discordLogin = (code: string) => 
    fetch( "https://tonysanti.com/prx/discordlogin/login", {
        method: "POST",
        body: JSON.stringify({ code }),                                 
        headers: {
            "Content-Type": "application/json",
        }
    }).then( async res => {
        const json = await res.json();
        cookie.set( "access_token", json.access_token, { expires: 7 } );
        cookie.set( "refresh_token", json.refresh_token );
        return json;
    }
);

export const discordFetchUser = async ( access_token: string ) => {
    return fetch( "https://discord.com/api/users/@me",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ access_token }`
        }
    }).then( async res => {
        return await res.json();
    }).catch( err => {
        console.log( err );
    });
}

export const discordSignOut = () => {
    cookie.remove( "access_token" );
    cookie.remove( "refresh_token" );
    window.location.href = "/";
}
