import * as React from 'react';
import process from 'process';
import { Container } from '../common/components/container';
import { Loading } from '../common/components/loading';

export function Login() {
    const env : string = process.env.NODE_ENV!;
    const discordClientId = "1131226870357172347";
    const DISCORD_REDIRECT_URL = env === "production" ? `https://analytikill.com` : "http://localhost:3000";
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${DISCORD_REDIRECT_URL}%2Fcb&response_type=code&scope=identify`;
    return (
        <Container>
            <Loading />
        </Container>
    );
}