import * as React from 'react';
import { Container } from '../common/components/container';
import { Loading } from '../common/components/loading';
import { discordLoginCallback } from '../dao/oAuth';
import { useDataContext } from '../DataContext';
import { useLocation } from 'wouter';


export function LoginCallBack() {
    const { discordUser, setDiscordUser } = useDataContext();
    const [, setLocation ] = useLocation();

    console.info( discordUser );

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if( code ){
        setLocation("/");
        ( async () => {
            const { discordUser } = await discordLoginCallback(code);
            if( discordUser?.id ) {
                setDiscordUser(discordUser);
            }
        })();
    }

    return (
        <Container>
            <Loading />
        </Container>
    );
}