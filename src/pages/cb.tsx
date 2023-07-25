import * as React from 'react';
import { Container } from '../common/components/container';
import { Loading } from '../common/components/loading';
import { discordLoginCallback } from '../dao/oAuth';
import { useDataContext } from '../DataContext';
import { useLocation } from 'wouter';


export function LoginCallBack() {
    const { setDiscordUser } = useDataContext();
    const [, setLocation ] = useLocation();    

    React.useEffect( () => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        if( code ){
            ( async () => {
                const { discordUser } = await discordLoginCallback(code);
                setDiscordUser(discordUser);
                setLocation("/");
            })();
        }
    }, [ setDiscordUser, setLocation ] );

    return (
        <Container>
            <Loading />
        </Container>
    );
}