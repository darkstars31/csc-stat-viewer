import * as React from "react";
import { Container } from "../common/components/container";
import { Card } from "../common/components/card";
import Select, { SingleValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { appConfig } from "../dataConfig";
import cookie from "js-cookie";
import { useEnableFeature } from "../common/hooks/enableFeature";
import { useDataContext } from "../DataContext";
import { TbClipboardCopy } from "react-icons/tb";
import { FaCheck, FaServer } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { Loading } from "../common/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Toggle } from "../common/components/toggle";
import { shortTeamNameTranslator } from "../common/utils/player-utils";
import { Player } from "../models";

dayjs.extend(relativeTime);

type server = {
    screenid: number,
    owner: string,
    port: number,
    type: string,
    password: string,
    datetime: string,
}

type serverDeets = {
    "protocol": number,
    "name": string,
    "map": string,
    "folder": string,
    "game": string,
    "appId": number,
    "players": number,
    "maxPlayers": number,
    "bots": number,
    "serverType": string,
    "environment": string,
    "visibility": number,
    "vac": number,
    "version": string,
    "port": number,
    "keywords": string,
    "gameId": string
}

export function CopyToClipboard ({ text } : { text: string } ) {
    const [hasCopied, setHasCopied] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (hasCopied) {
            setTimeout(() => {
                setHasCopied(!hasCopied);
            }, 2250);
        }
    }, [hasCopied]);
    return !hasCopied ? <TbClipboardCopy className="mt-1 inline cursor-pointer" onClick={() =>{ setHasCopied(!hasCopied); navigator.clipboard.writeText(text)}} /> : <FaCheck className="text-green-500 mt-1 inlinecursor-pointer animate-bounce" />
}


export function OwnedServers ( { server, onChange } : { server : any, onChange: (x: boolean) => void} ) {
    const { loggedinUser } = useDataContext();
    const [serverDeets, setServerDeets] = React.useState<serverDeets | null>(null);
    const [isShuttingDown, setIsShuttingDown] = React.useState<boolean>(false);

    const isDeetsNull = serverDeets === null

    React.useEffect( () => {
        setTimeout(() => {
            ( async () => {
                const response = await fetch(`${appConfig.endpoints.analytikill}/servers/deets`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${cookie.get("jwt")}`
                    },
                    body: JSON.stringify({
                        port: server.port
                    })
                });
                if (response.ok) {
                    setServerDeets(await response.json());
                }
            }
            )()
        }, 1500 )

    },[ server, isDeetsNull ]);

    const shutdown = async () => {
        setIsShuttingDown(true);
        const response = await fetch(`${appConfig.endpoints.analytikill}/servers/stop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get("jwt")}`
            },
            body: JSON.stringify({
                id: server.screenid
            })
        });

        if (response.ok) {
            onChange(true);
        }
    }

    const connectCode = `connect servers.analytikill.com:${server.port}${server.password ? `;password ${server.password}` : ""}`
    //const timeSinceServerStart = dayjs(+server.datetime).fromNow()
    const timeTilServerShutdown = dayjs().to(+server.datetime+1000*60*60*3,true);
    const isOwner = loggedinUser?.name === server.owner;

    const skeletonClassNames = "animate-pulse bg-gray-900 rounded inset-0 m-1 p-1"

    console.info(server);

    return (
        <tr>
            <td className={ !serverDeets ? skeletonClassNames : ""}>{serverDeets?.name}</td>
            <td>{timeTilServerShutdown}</td>
            <td className="uppercase">{server.type?.split(".")[0]}</td>
            <td className={ !serverDeets ? skeletonClassNames : ""}>{serverDeets?.map}</td>
            <td className={ !serverDeets ? skeletonClassNames : ""}>{serverDeets ? serverDeets?.players-serverDeets?.bots : ""}{serverDeets ? `/` : ""}{serverDeets?.maxPlayers}</td>
            <td className="flex flex-row justify-between m-1 p-1 rounded bg-gray-800 inset-0 gap-2">
                { (isOwner || !server.password) &&
                    <>
                        <pre>{connectCode}</pre>
                        <CopyToClipboard text={connectCode} />
                    </>
                }
                { !isOwner && server.password &&
                    <pre>Private</pre>
                }
            </td>
            <td>
                <div className="flex flex-col gap-2 justify-center">
                    { loggedinUser?.name === server.owner && <button onClick={() => shutdown()} disabled={isShuttingDown} className="w-32 bg-blue-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">{isShuttingDown ? <ImSpinner9 className="inline animate-spin" /> : "Shutdown"}</button> }
                </div>
            </td>
        </tr> 
    )
}

const Field = ({label, children}: {label: string, children: React.ReactNode}) => {
    return (
        <div className="flex flex-wrap gap-3">
            <div className="basis-1/3">
                {label}
            </div>
            <div className="basis-1/3 grow">
                {children}
            </div>
        </div>
    )
}


const MatchPlayerSelect = ( { index, availablePlayers, onChange }: { index: number, availablePlayers: Player[], onChange: ( { index, player } : {index: number, player: Player} ) => void}) => {
    const [selectedPlayers, setSelectedPlayers] = React.useState<SingleValue<{label: string;value: Player;}>>();

    const playerOptions = availablePlayers.map( player => ({ label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.role}`, value: player }))

    const changeHandler = (newValue: SingleValue<{label: string;value: Player;}>) => {
        if (newValue) {
            setSelectedPlayers(newValue);
            onChange( {index, player: newValue.value });
        }
    }

    return  (
        <div className="flex flex-row w-full text-xs">
                        <Select
                            placeholder={`Player ${index}`}
                            isClearable={true}
                            className="grow"
                            unstyled
                            value={selectedPlayers}
                            isSearchable={true}
                            classNames={selectClassNames}
                            options={playerOptions}
                            onChange={changeHandler}
                        />
                    </div>
    )
}

export function Servers() {
    const { loggedinUser, isLoading, players } = useDataContext();
    const [selectedMap, setSelectedMap] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Anbuis", value: "de_anubis"});
    const [selectedServerType, setSelectedServerType] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Pug & Prac", value: "pug&prac"});
    const [isPrivate, setIsPrivate] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>("");
    const [, setResult] = React.useState<any>();
    const [shouldRefresh, setShouldRefresh] = React.useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [servers, setServers] = React.useState<server[]>([]);
    const [error, setError] = React.useState<string>("");
    const enableFeature = useEnableFeature('canRequestServers');

    const [ matchPlayers, setMatchPlayers ] = React.useState<Player[]>([]);
    const [ matchSettings, setMatchSettings ] = React.useState<{ [key: string]: string | number | boolean | string[]}>({ team1Name: "Team 1", team2Name: "Team 2" });
    const [ matchConVars, setMatchConVars ] = React.useState<{ [key: string]: string | number | boolean | string[]}>({});

    const availableMatchPlayers = players.filter( p => !matchPlayers.includes(p) );
    console.info(matchPlayers)

    React.useEffect(() => {
        (async () => {
            if(shouldRefresh === true && !isLoading ){
                setTimeout( async () => {
                    const response = await fetch(`${appConfig.endpoints.analytikill}/servers/owned`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${cookie.get("jwt")}`
                        }
                    })
                    if( response.ok ){
                        const data = await response.json();
                        setServers(data);
                    }
                    setShouldRefresh(false);
            }, 1500);
            setInterval( () => {
                setShouldRefresh(true);
            }, 1000 * 60 * 3);
        }
        })()
    }, [ shouldRefresh, isLoading ]);


    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsSubmitting(true);
        const response = await fetch(`${appConfig.endpoints.analytikill}/servers/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get("jwt")}`
            },
            body: JSON.stringify({
                map: selectedMap?.value,
                serverType: selectedServerType?.value,
                password,
                isPrivate,
                matchConfig: { players: matchPlayers, maps: [selectedMap?.value], ...matchConVars }
            })
        })
        if( response.ok ){
            const data = await response.json();
            setShouldRefresh(true);
            setResult(data);
        }
        if( !response.ok ){
            const data = await response.json();
            setError(data.result);
            setTimeout(() => {setError("")}, 5000);
        }
        setIsSubmitting(false);
    };

    if( !loggedinUser ){
        return (
            <Container>
                <h2 className="text-3xl font-bold sm:text-4xl">Servers</h2>
                <p>
                    You must be logged into to use this feature.
                </p>
            </Container>
        )
    }

    if( !enableFeature ){
        return (
            <Container>
                <h2 className="text-3xl font-bold sm:text-4xl">Servers</h2>
                <p>
                    This feature currently under development and only available to beta testers.
                </p>
            </Container>
        )
    }

    const serverTypeOptions = [
        {label: "Pug & Prac", value: "pug&prac", isDisabled: false},
        {label: "Retakes", value: "retakes", isDisabled: false},
        {label: "Deathmatch (WIP)", value: "deathmatch", isDisabled: process.env.NODE_ENV! === "production"},
        {label: "Match (WIP)", value: "match", isDisabled: process.env.NODE_ENV! === "production"},
    ]

    const mapOptions = [
        {label: "Anbuis", value: "de_anubis"},
        {label: "Ancient", value: "de_ancient"},
        {label: "Dust2", value: "de_dust2"},
        {label: "Inferno", value: "de_inferno"},
        {label: "Nuke", value: "de_nuke"},
        {label: "Mirage", value: "de_mirage"},
        {label: "Overpass", value: "de_overpass"},
        {label: "Vertigo", value: "de_vertigo"},
        {label: "Thera (Community)", value: "de_thera"},
        {label: "Mills (Community)", value: "de_mills"},
        //{label: "Train", value: "de_train"},
        //{label: "Dust", value: "de_dust"},
        //{label: "Cobblestone", value: "de_cbbl"},
        //{label: "Cache", value: "de_cache"},
        //{label: "Cobblestone", value: "de_cobblestone"},
    ]

    const onPlayerChange = ( {index, player}: any ) => {
        setMatchPlayers(prev => {
            const newMatchPlayers = [...prev];
            newMatchPlayers[index-1] = player;
            return newMatchPlayers
        });
    }

    const handleMatchSettingsChange = ( property: { [key: string]: any } ) => {
        setMatchSettings( prev => ({ ...prev, ...property}));
    }
    const handleMatchConVarsChange = ( {key, value}: any ) => {
        setMatchConVars(prev => ({ ...prev, [key]: value }));
    }


    return (
        <Container>
            <h2 className="text-3xl font-bold sm:text-4xl text-center m-2 p-2">Servers On-Demand</h2>
            <h2 className="font-bold text-center m-1 text-gray-500">(Beta)</h2>
            <div className="flex flex-row flex-wrap w-full gap-4">
                <Card className="grow">
                    <div className="text-xl font-bold text-center uppercase">Server Settings</div>
                    <form className="w-full max-w-lg" onSubmit={onSubmit}>
                        <Field key={"type"} label="Type">
                            <Select
                                classNames={selectClassNames}
                                unstyled
                                isSearchable={false}
                                options={serverTypeOptions}
                                onChange={setSelectedServerType}
                                value={selectedServerType}
                            />
                        </Field>
                        <Field key={"map"} label="Map">
                            <Select
                                classNames={selectClassNames}
                                unstyled
                                isSearchable={false}
                                options={mapOptions}
                                onChange={setSelectedMap}
                                value={selectedMap}
                            />
                        </Field>
                        <Field key={"duration"} label="Duration (Hours)">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:cursor-not-allowed"
                                type="number" 
                                value={3} 
                                disabled 
                            />
                        </Field>
                        <Field key={"slots"} label="Player Slots">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:cursor-not-allowed"
                                type="number" 
                                value={10} 
                                disabled 
                            />
                        </Field>
                        <Field key={"private"} label="Private Server">
                            <Toggle checked={isPrivate} onChange={setIsPrivate} />
                        </Field>
                        <div className={ isPrivate ? "" : "hidden"}>
                            <Field key={"password"} label="Password">
                                <input
                                    type="text"
                                    name="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Field>  
                        </div>                                         
                        <div className="flex items-center justify-end m-2 p-2">
                            <button type="submit" disabled={isSubmitting} className="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">{isSubmitting || shouldRefresh ? <ImSpinner9 className="inline animate-spin" /> : "Request"}</button>
                        </div>
                    </form>
                    { error &&
                    <div className="text-red-500">
                        {error}
                    </div>
                    }
                </Card>
                <Card className="basis-1/2">
                    <div>
                        <div className="font-bold uppercase">Pug/Prac Commands</div>
                        <pre>
                            .help - Shows available commands<br />
                            .prac - Enter Practice Mode<br />
                            .rethrow - Rethrows last nade<br />
                            .exitprac - Exit Practice Mode<br />
                            .r - Ready Up for pug<br />
                            .map &#123;map_name&#125; - Changes the Map<br />
                        </pre> 
                    </div>
                </Card>
            </div>
            {
                selectedServerType?.value === "match" &&
                <div>
                    <Card>
                        <div className="text-xl font-bold text-center uppercase">Match Configuration</div>
                        <div className="flex flex-row w-full justify-around">
                            <div className="basis-1/3">
                                <div className="text-xl font-bold text-center">
                                <span><input className="bg-midnight2 uppercase text-center shadow appearance-none border-solid border-0 border-b-1 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="text" value={matchSettings.team1Name as string} onChange={e => handleMatchSettingsChange( {"team1Name": e.target.value})} /></span>
                                </div>
                                { [...Array(5)].map((_,index) => <MatchPlayerSelect key={index} index={index+1} availablePlayers={availableMatchPlayers} onChange={onPlayerChange} />) }
                                </div>
                                <div className="basis-1/4 flex flex-col gap-1 w-full bg-midnight1 rounded m-2 p-2">                               
                                    <div className="flex flex-row justify-between">
                                        <div>Team Damange</div> <Toggle checked={matchConVars.friendlyFire as boolean} onChange={ () => handleMatchConVarsChange( {"friendlyFire": !matchConVars.friendlyFire})} />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div>Play Out (24 Rounds)</div> <Toggle checked={matchConVars.playOut as boolean} onChange={ () => handleMatchConVarsChange( {"playOut": !matchConVars.playOut})} />
                                    </div>                                   
                                </div>
                            <div className="basis-1/3">
                                <div className="text-xl font-bold text-center ">
                                <span><input className="bg-midnight2 uppercase text-center shadow appearance-none border-solid border-0 border-b-1 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="text" value={matchSettings.team2Name as string} onChange={e => handleMatchSettingsChange( {"team2Name": e.target.value})} /></span>
                                </div>
                                { [...Array(5)].map((_,index) => <MatchPlayerSelect key={index} index={index+6} availablePlayers={availableMatchPlayers} onChange={onPlayerChange} />) }
                            </div>
                        </div>
                    </Card>
                </div>
            }
            <div className="w-full">
                <table className="table-auto w-full">
                    <thead className="text-left underline decoration-yellow-400">
                        <tr className="">
                            <th>Name</th>
                            <th>Time Left</th>
                            <th>Type</th>
                            <th>Map</th>
                            <th>Players</th>
                            <th>Server</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        servers && servers?.map( (server) => <OwnedServers key={server.screenid} server={server} onChange={setShouldRefresh} /> )
                    }
                    </tbody>
                </table>
                { shouldRefresh && <div className="flex flex-row justify-center m-4 p-2"><Loading /></div>}
                { servers.length === 0 && !shouldRefresh && <div className="text-center font-bold m-4 p-2 text-gray-500"> <FaServer size={64} className="inline p-4" />There aren't any servers running, start one, maybe?</div> }
            </div>
        </Container>
    )
}