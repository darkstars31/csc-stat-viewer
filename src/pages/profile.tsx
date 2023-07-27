import * as React from 'react';
import { Container } from '../common/components/container';
import * as Containers from "../common/components/containers";
import { Input } from '../common/components/input';
import { LuConstruction } from 'react-icons/lu';
import { useDataContext } from '../DataContext';
import { useFetchPlayerProfile } from '../dao/StatApiDao';
import { Loading } from '../common/components/loading';
//import cookie from 'js-cookie';
//import { queryClient } from '../App';
//import { useDebounce } from '../common/hooks/debounce';

export function Profile() {
    const { discordUser } = useDataContext();
    const { data: profile, isLoading } = useFetchPlayerProfile(discordUser?.id);
    const [ profileSettings, setProfileSettings ] = React.useState({
        isIGL: profile?.isIGL ?? false,
        twitchUsername: profile?.twitch_username || "",
    })

    //const debouncedProfileSettings = useDebounce( profileSettings, 500);

    const isDevelopment = process.env.NODE_ENV !== "production";

    // React.useEffect(() => {
    //     if( isLoading ) return;
    //     if( JSON.stringify(debouncedProfileSettings) !== JSON.stringify(profile) ){
    //         fetch( "https://tonysanti.com/prx/csc-stat-api/profile",
    //         {
    //             method: "POST",
    //             body: JSON.stringify( profileSettings ),
    //             headers: {
    //                 "Authorization": "Bearer " + cookie.get("jwt"),
    //                 "Content-Type": "application/json",
    //             }
    //         }).then( () => queryClient.invalidateQueries(["profile", discordUser?.id]));
    //     }
    // }, [ debouncedProfileSettings ])

    const onChange = ( key: string, value: string | number | boolean ) => {
        setProfileSettings( { ...profileSettings, [key]: value });
    }

    return (
        <Container>
            <Containers.StandardBackgroundPage>
                <h1>Profile</h1>
                { isLoading && <Loading /> }
                { isDevelopment ?
                        <>                
                        <div>
                            <input
                                className="inline-block"
                                type="checkbox"
                                value=""
                                onChange={ () => onChange( "isIGL", !profileSettings.isIGL) }
                                id="checkboxChecked"
                                checked={ profileSettings.isIGL } 
                            />
                            <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="checkboxChecked">
                                Are you an IGL?
                            </label>
                        </div>
                        <div>
                            <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                                Twitch Username
                            </label>
                            <Input
                                className="basis-1/2 grow"
                                label=""
                                placeHolder="Twitch Username"
                                type="text"
                                onChange={ ( e ) => onChange( "twitchUsername", e.currentTarget.value.trim())}
                                value={profileSettings.twitchUsername}
                            />
                        </div>
                        </>
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