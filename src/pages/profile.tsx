import * as React from 'react';
import { Container } from '../common/components/container';
import * as Containers from "../common/components/containers";
import { Input } from '../common/components/input';
import { LuConstruction } from 'react-icons/lu';
import { useDataContext } from '../DataContext';
import { useFetchPlayerProfile } from '../dao/StatApiDao';
import cookie from 'js-cookie';
import { queryClient } from '../App';
import Select from 'react-select';
import { selectClassNames } from '../common/utils/select-utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export function Profile() {
    const { discordUser, players } = useDataContext();
    const currentPlayer = players.find( p => p.discordId === discordUser?.id );
    const { data: profile, isFetching } = useFetchPlayerProfile(discordUser?.id);
    const [ isSaving, setIsSaving ] = React.useState(false);
    console.info( profile?.preferred_roles?.split(",")?.map( r => ({ label: r, value: r })) );
    const [ profileSettings, setProfileSettings ] = React.useState<Partial<{ isIGL: boolean, twitchUsername: string, 
        youtubeChannel: string, 
        favoriteWeapon: string, 
        favoriteRole: string, 
        favoriteMap: string
    }>>();

    React.useEffect( () => {
        setProfileSettings({
            isIGL: profile?.isIGL ?? false,
            twitchUsername: profile?.twitch_username ?? undefined,
            youtubeChannel: profile?.youtube_channel ?? undefined,
            favoriteWeapon: profile?.favorite_weapon ?? undefined,
            favoriteRole: profile?.favorite_role ?? undefined,
            favoriteMap: profile?.favorite_map ??undefined,
        });
    }, [ profile, isFetching ]);

    const isDevelopment = process.env.NODE_ENV !== "production";

    const weaponOptions = [
        { label: "AK-47", value: "AK-47"},
        { label: "M4A4", value: "M4A4"},
        { label: "M4A1-S", value: "M4A1-S"},
        { label: "Awp", value: "Awp"},
    ];

    const roleOptions = [
        { label: "Alphapack Leader", value: "Alphapack Leader"},
        { label: "Entry", value: "Entry"},
        { label: "Refragger", value: "Refragger"},
        { label: "Support", value: "Support"},
        { label: "Lurker", value: "Lurker"},
        { label: "Baiter", value: "Baiter"},
        { label: "Awp Crutch", value: "Awp Crutch"},
        { label: "Bomb Carrier", value: "Bomb Carrier"},
        { label: "Site Anchor", value: "Site Anchor"},
        { label: "Camper", value: "Camper"},
        { label: "Off Angle McDangle", value: "Off Angle McDangle"},
    ];

    const mapOptions = [
        { label: "de_dust2", value: "de_dust2"},
        { label: "de_vertigo", value: "de_vertigo"},
        { label: "de_mirage", value: "de_mirage"},
        { label: "de_ancient", value: "de_ancient"},
        { label: "de_anubis", value: "de_anubis"},
        { label: "de_nuke", value: "de_nuke"},
        { label: "de_overpass", value: "de_overpass"},
        { label: "de_inferno", value: "de_inferno"},
    ];

    const onSave = ( e: React.FormEvent ) => {
        e.preventDefault();
        setIsSaving(true);
        fetch( "https://tonysanti.com/prx/csc-stat-api/profile",
        {
            method: "POST",
            body: JSON.stringify(profileSettings), 
            headers: {
                "Authorization": "Bearer " + cookie.get("jwt"),
                "Content-Type": "application/json",
            }
        }).then( () => queryClient.invalidateQueries(["profile", discordUser?.id]))
        .finally( () => setIsSaving(false));
    }

    const onChange = ( key: string, value: string | number | boolean | unknown ) => {
        setProfileSettings( { ...profileSettings, [key]: value });
    }

    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">{currentPlayer?.name} Profile</h2>
            </div>
            <p className="mt-4 text-gray-300">
                    Settings & Configuration
            </p>
            <Containers.StandardBackgroundPage>
                <h1 className='text-xl mb-4'>CS:Confederation League Details</h1>
                    <div className='flex flex-wrap gap-4'>
                        <Input
                            className="grow text-gray-400"
                            label='Tier'
                            placeHolder="Tier"
                            type="text"
                            isDisabled
                            onChange={() => {} }
                            value={currentPlayer?.tier.name}
                        />
                        <Input
                            className="grow text-gray-400"
                            label='Franchise'
                            placeHolder="Franchise"
                            type="text"
                            isDisabled
                            onChange={() => {} }
                            value={currentPlayer?.team?.franchise?.name}
                        />
                        <Input
                            className="grow text-gray-400"
                            label='Team'
                            placeHolder="Team"
                            type="text"
                            isDisabled
                            onChange={() => {} }
                            value={currentPlayer?.team?.name}
                        />
                        <Input
                            className="grow text-gray-400"
                            label='Player Type'
                            placeHolder="Player Type"
                            type="text"
                            isDisabled
                            onChange={() => {} }
                            value={currentPlayer?.type }
                        />
                    </div>
            </Containers.StandardBackgroundPage>
            <br />
            {/* <Containers.StandardBackgroundPage classNames={`${isFetching || isSaving || true ? "" : "hidden"} bg-opacity-75 fixed w-auto`}>
                Loading
            </Containers.StandardBackgroundPage> */}
            <Containers.StandardBackgroundPage>
                <h1 className='text-xl mb-4'>Settings</h1>
                { isDevelopment ?                  
                <form onSubmit={onSave}>
                    <div className='flex flex-wrap gap-4'>                                 
                        <div className='basis-1/4 py-2'>
                            <label className="inline-block pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="checkboxChecked">
                                Are you an IGL?
                            </label>
                            <div className='inline-block text-center pt-4'>
                                <input
                                    className="inline-block w-4 h-4"
                                    type="checkbox"
                                    value=""
                                    onChange={ () => onChange( "isIGL", !profileSettings?.isIGL) }
                                    id="checkboxChecked"
                                    checked={ profileSettings?.isIGL } 
                                />
                            </div>         
                        </div>
                        <div className='basis-1/4 py-2'>
                            <label className="inline-block pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="">
                                Favorite Weapon
                            </label>
                            <Select
                                placeholder="Not Specified"
                                isClearable={true}
                                className="grow text-xs"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                value={ weaponOptions.find( option => option.value === profileSettings?.favoriteWeapon ) }
                                options={weaponOptions}
                                onChange={( option ) => onChange( "favoriteWeapon", option?.value ) }
                            />
                        </div>
                        <div className='basis-1/4 py-2'>
                            <label className="pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="">
                                Preferred Role
                            </label>
                            <Select
                                placeholder="Not Specified"
                                isClearable={true}
                                className="grow text-xs"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                value={ roleOptions.find( option => option.value === profileSettings?.favoriteRole )}
                                options={roleOptions}
                                onChange={( option ) => onChange( "favoriteRole", option?.value ) }
                            />
                        </div>
                        <div className='basis-1/4 my-2 py-2'>
                            <label className="inline-block pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="">
                                Favorite Map
                            </label>
                            <Select
                                placeholder="Not Specified"
                                isClearable={true}
                                className="grow text-xs"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                value={ mapOptions.find( option => option.value === profileSettings?.favoriteMap) }
                                options={ mapOptions}
                                onChange={( option ) => onChange( "favoriteMap", option?.value ) }
                            />
                        </div>
                    </div>
                    <div>
                            <div className='basis-1/2 py-2'>
                                <Input
                                    className="basis-1/2 grow"
                                    label='Twitter / X'
                                    placeHolder="Twitter / X handle"
                                    type="text"
                                    onChange={ ( e ) => onChange( "twitchUsername", e.currentTarget.value.trim())}
                                    value={profileSettings?.twitchUsername}
                                />
                            </div>
                            <div className='basis-1/2 py-2'>
                                <Input
                                    className="basis-1/2 grow"
                                    label='Twitch Channel'
                                    placeHolder="Twitch Username"
                                    type="text"
                                    onChange={ ( e ) => onChange( "twitchUsername", e.currentTarget.value.trim())}
                                    value={profileSettings?.twitchUsername}
                                />
                            </div>
                            <div className='basis-1/2 py-2'>
                                <Input
                                    className="basis-1/2 grow"
                                    label='Youtube Channel'
                                    placeHolder="Youtube Channel"
                                    type="text"
                                    onChange={ ( e ) => onChange( "youtubeChannel", e.currentTarget.value.trim())}
                                    value={profileSettings?.youtubeChannel}
                                />
                            </div>
                        </div>
                    <div className='py-2 flex justify-end'>
                        <button onClick={onSave} disabled={isSaving} className='flex flex-row'>
                            { isSaving && <div className="animate-spin h-[1em] w-[1em] m-1"><AiOutlineLoading3Quarters /></div>} 
                            { isSaving ? "Saving..." : "Save" }
                        </button>
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