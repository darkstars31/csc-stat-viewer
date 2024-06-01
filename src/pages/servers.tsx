import * as React from "react";
import { Container } from "../common/components/container";
import { Card } from "../common/components/card";
import Select, { SingleValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { appConfig } from "../dataConfig";
import cookie from "js-cookie";
import { useEnableFeature } from "../common/hooks/enableFeature";
import { useDataContext } from "../DataContext";


export function Servers() {
    const { loggedinUser } = useDataContext();
    const [selectedMap, setSelectedMap] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Anbuis", value: "de_anubis"});
    const [selectedServerType, setSelectedServerType] = React.useState<SingleValue<{label: string; value: string;}>>({label: "Pug/Prac", value: "match"});
    const [password, setPassword] = React.useState<string>("");
    const [result, setResult] = React.useState<any>();
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [ownedServers, setOwnedServers] = React.useState<any>([]);
    const enableFeature = useEnableFeature('canRequestServers');

    React.useEffect(() => {
        (async () => { const response = await fetch(`${appConfig.endpoints.analytikill}/servers/owned`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookie.get("jwt")}`
                }
            })
            if( (response).ok ){
                const data = await response.json();
                setOwnedServers(data);
            }
        })()
    }, [ result ]);


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
                serverType: selectedServerType?.value
            })
        })
        if( response.ok ){
            
            const data = await response.json();
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
            <h2 className="text-3xl font-bold sm:text-4xl text-center m-4 p-4">AnalytiKill Pug/Prac/Retake Servers</h2>
            <div className="flex flex-row flex-wrap w-full gap-4">
                <Card className="grow">
                    <form className="w-full max-w-lg" onSubmit={onSubmit}>
                    <div className="flex flex-wrap gap-3">
                            <div className="basis-1/4">
                                Player Slots
                            </div>
                            <div className="basis-1/4">
                            10
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
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{isSubmitting ? "Requesting..." : "Request"}</button>
                        </div>

                    </form>
                </Card>
                <Card>
                    <div>
                        How to use
                    </div>
                    <div>
                        Pug/Prac Commands
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
            {result && 
                <Card>
                    Connect
                    <pre>{result.result}</pre>
                </Card>
            }
            {
               ownedServers && ownedServers?.map( (server: { id: any; name: any; }) => <Card><pre>{JSON.stringify(server, null, 2)}</pre></Card> )
            }
        </Container>
    )
}