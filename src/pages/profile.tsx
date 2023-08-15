import * as React from 'react';
import { Container } from '../common/components/container';
import * as Containers from "../common/components/containers";
import { Input } from '../common/components/input';
import { LuConstruction } from 'react-icons/lu';
import { useDataContext } from '../DataContext';
import { useFetchPlayerProfile } from '../dao/StatApiDao';
import { Loading } from '../common/components/loading';
import cookie from 'js-cookie';
import { queryClient } from '../App';

export function Profile() {
    const { discordUser, players } = useDataContext();
    const currentPlayer = players.find( p => p.discordId === discordUser?.id );
    const { data: profile, isLoading } = useFetchPlayerProfile(discordUser?.id);
    const [ profileSettings, setProfileSettings ] = React.useState({
        isIGL: profile?.isIGL || false,
        twitchUsername: profile?.twitch_username || "",
    })

    if( isLoading ) {
        return <Container><Loading /></Container>
    }

    const isDevelopment = process.env.NODE_ENV !== "production";

    const onSave = () => {   
        fetch( "https://tonysanti.com/prx/csc-stat-api/profile",
        {
            method: "POST",
            body: JSON.stringify( profileSettings ),
            headers: {
                "Authorization": "Bearer " + cookie.get("jwt"),
                "Content-Type": "application/json",
            }
        }).then( () => queryClient.invalidateQueries(["profile", discordUser?.id]));
    }

    const onChange = ( key: string, value: string | number | boolean ) => {
        setProfileSettings( { ...profileSettings, [key]: value });
    }

    return (
        <Container>
            <Containers.StandardBackgroundPage>
                <h1>Profile</h1>
                <div className='flex gap-4'>
                    <Input
                        className="basis-1/3 grow"
                        label='Tier'
                        placeHolder="Tier"
                        type="text"
                        isDisabled
                        onChange={() => {} }
                        value={currentPlayer?.tier.name}
                    />
                     <Input
                        className="basis-1/3 grow"
                        label='Franchise'
                        placeHolder="Franchise"
                        type="text"
                        isDisabled
                        onChange={() => {} }
                        value={currentPlayer?.team?.franchise?.name}
                    />
                     <Input
                        className="basis-1/3 grow"
                        label='Team'
                        placeHolder="Team"
                        type="text"
                        isDisabled
                        onChange={() => {} }
                        value={currentPlayer?.team?.name}
                    />
                </div>
                { isDevelopment ?
                    <form onSubmit={onSave}>                                     
                        <div className='py-2'>
                            <label className="inline-block pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="checkboxChecked">
                                Are you an IGL?
                            </label>
                            <input
                                className="inline-block"
                                type="checkbox"
                                value=""
                                onChange={ () => onChange( "isIGL", !profileSettings.isIGL) }
                                id="checkboxChecked"
                                checked={ profileSettings.isIGL } 
                            />
                        </div>
                        <div className='py-2'>
                            <Input
                                className="basis-1/2 grow"
                                label='Twitch Username'
                                placeHolder="Twitch Username"
                                type="text"
                                onChange={ ( e ) => onChange( "twitchUsername", e.currentTarget.value.trim())}
                                value={profileSettings.twitchUsername}
                            />
                        </div>
                        <div className='py-2 flex justify-end'>
                            <button onClick={onSave}>Save</button>
                        </div>       
                    </form>
                : 
                <div className='mx-auto w-full text-xl text-center flex justify-center leading-8 gap-4'>
                    <LuConstruction size={36} className='flex-left' />
                    Under Construction
                </div>
            }
            </Containers.StandardBackgroundPage>
        </Container>
    );
}