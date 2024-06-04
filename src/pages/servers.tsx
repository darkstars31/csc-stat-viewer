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
import { FaCheck } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";
dayjs.extend(relativeTime);

type server = {
    screenid: number,
    owner: string,
    port: number,
    type: string,
    password: string,
    datetime: string,
    deets: serverDeets
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


export function OwnedServers ( { server, onChange } : { server : any, onChange: (x: boolean) => void} ) {
    const { loggedinUser } = useDataContext();
    const [isShuttingDown, setIsShuttingDown] = React.useState<boolean>(false);
    const [hasCopied, setHasCopied] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (hasCopied) {
            setTimeout(() => {
                setHasCopied(!hasCopied);
            }, 2250);
        }
    }, [hasCopied]);

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

    return (
        <tr>
            <td>{server.deets?.name}</td>
            <td>{dayjs(server.datetime).fromNow()}</td>
            <td className="uppercase">{server.type?.split(".")[0]}</td>
            <td>{server.deets?.map}</td>
            <td>{server.deets?.players-server.deets?.bots}/{server.deets?.maxPlayers}</td>
            <td className="flex flex-row justify-between m-1 p-1 rounded bg-gray-800 inset-0 gap-2">
                <pre>{ loggedinUser?.name === server.owner && server.password ?  connectCode : "Private"}</pre> 
                { !hasCopied ?<TbClipboardCopy className="mt-1 inline cursor-pointer" onClick={() =>{ setHasCopied(!hasCopied); navigator.clipboard.writeText(connectCode)}} /> : <FaCheck className="text-green-500 mt-1 inlinecursor-pointer animate-bounce" /> }
            </td>
            <td>
                <div className="flex flex-col gap-2 justify-center">
                    { loggedinUser?.name === server.owner && <button onClick={() => shutdown()} disabled={isShuttingDown} className="w-32 bg-blue-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">{isShuttingDown ? <ImSpinner9 className="inline animate-spin" /> : "Shutdown"}</button> }
                </div>
            </td>
        </tr> 
    )
}

export function Servers() {
    const { loggedinUser, isLoading } = useDataContext();
    const [selectedMap, setSelectedMap] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Anbuis", value: "de_anubis"});
    const [selectedServerType, setSelectedServerType] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Pug/Prac", value: "match"});
    const [password, setPassword] = React.useState<string>("");
    const [, setResult] = React.useState<any>();
    const [shouldRefresh, setShouldRefresh] = React.useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [ownedServers, setOwnedServers] = React.useState<server[]>([]);
    const enableFeature = useEnableFeature('canRequestServers');

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
                setOwnedServers(data);
            }
            setShouldRefresh(false);
            }, 1500);
        }
        })()
    }, [ shouldRefresh, isLoading ]);


    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsSubmitting(true);
        console.info("Submitted");
        const response = await fetch(`${appConfig.endpoints.analytikill}/servers/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get("jwt")}`
            },
            body: JSON.stringify({
                map: selectedMap?.value,
                serverType: selectedServerType?.value,
                password
            })
        })
        if( response.ok ){
            
            const data = await response.json();
            setShouldRefresh(true);
            setResult(data);
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

    return (
        <Container>
            <h2 className="text-3xl font-bold sm:text-4xl text-center m-2 p-2">Servers On-Demand</h2>
            <h2 className="font-bold text-center m-1 text-gray-500">(Beta)</h2>
            <div className="flex flex-row flex-wrap w-full gap-4">
                <Card className="grow">
                    <div className="text-xl font-bold text-center uppercase">Server Settings</div>
                    <form className="w-full max-w-lg" onSubmit={onSubmit}>
                        <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Duration (Hours)
                            </div>
                            <div className="basis-1/4">
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:cursor-not-allowed"
                                    type="number" 
                                    value={3} 
                                    disabled 
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Player Slots
                            </div>
                            <div className="basis-1/4">
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:cursor-not-allowed"
                                    type="number" 
                                    value={10} 
                                    disabled 
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Map
                            </div>
                            <div className="basis-1/4">
                                <Select
                                    classNames={selectClassNames}
                                    unstyled
                                    isSearchable={false}
                                    options={[
                                        {label: "Anbuis", value: "de_anubis"},
                                        {label: "Ancient", value: "de_ancient"},
                                        {label: "Dust2", value: "de_dust2"},
                                        {label: "Inferno", value: "de_inferno"},
                                        {label: "Nuke", value: "de_nuke"},
                                        {label: "Mirage", value: "de_mirage"},
                                        {label: "Overpass", value: "de_overpass"},
                                        {label: "Vertigo", value: "de_vertigo"},
                                        //{label: "Train", value: "de_train"},
                                        //{label: "Dust", value: "de_dust"},
                                        //{label: "Cobblestone", value: "de_cbbl"},
                                        //{label: "Cache", value: "de_cache"},
                                        //{label: "Cobblestone", value: "de_cobblestone"},
                                    ]}
                                    onChange={setSelectedMap}
                                    value={selectedMap}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Type
                            </div>
                            <div className="basis-1/4">
                                <Select
                                        classNames={selectClassNames}
                                        unstyled
                                        isSearchable={false}
                                        options={[
                                            {label: "Pug/Prac", value: "match"},
                                            {label: "Retakes", value: "retakes"},
                                        ]}
                                        onChange={setSelectedServerType}
                                        value={selectedServerType}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Password
                            </div>
                            <div className="basis-1/4">
                                <input
                                    type="text"
                                    name="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center m-2 p-2">
                            <button type="submit" disabled={isSubmitting} className="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">{isSubmitting ? <ImSpinner9 className="inline animate-spin" /> : "Request"}</button>
                        </div>

                    </form>
                </Card>
                <Card>
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
            {/* {result && 
                <Card>
                    Connect
                    <pre>{result.result}</pre> <ToolTip type="generic" message="Copy to clipboard"><TbClipboardCopy onClick={() => navigator.clipboard.writeText(result.result)} /></ToolTip>
                </Card>
            } */}
            <div className="w-full">
                <table className="table-auto w-full">
                    <thead className="text-left text-gray-500 decoration-1 border-b border-yellow-200">
                        <tr>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Map</th>
                            <th>Players</th>
                            <th>Server</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        ownedServers && ownedServers?.map( (server) => <OwnedServers key={server.screenid} server={server} onChange={setShouldRefresh} /> )
                    }
                    </tbody>
                </table>
            </div>
        </Container>
    )
}