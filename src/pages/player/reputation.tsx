import * as React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { useDataContext } from "../../DataContext";
import { useFetchReputation } from "../../dao/analytikill";
import { queryClient } from "../../App";
import { analytikillHttpClient } from "../../dao/httpClients";


export function Reputation( { playerDiscordId }: { playerDiscordId: string | undefined } ) {
    const { discordUser } = useDataContext();
    const [ isMouseOver, setIsMouseOver ] = React.useState(false);
    const { data: reputation = undefined, isLoading } = useFetchReputation( playerDiscordId );

    const hasAlreadyRepped = Object.keys(reputation?.plusRep ?? {}).includes(discordUser?.id ?? "");

    const handleRep = async ( action:  "add" | "remove") => {
        await analytikillHttpClient.post(`/analytikill/plusRep`,
            {
                action, 
                discordId: playerDiscordId 
            })
            .then( () => queryClient.invalidateQueries({ queryKey:["Reputation", playerDiscordId]}));
    };

    const gradientCSS = "bg-clip-text bg-gradient-to-r from-purple-300 to-violet-500 text-transparent hover:cursor-pointer";

    if ( isLoading ) {
        return <div className="w-16" />;
    }

    if ( !discordUser ){
        return (
            <div className={`text-center text-sm m-2 font-semibold`}>
                <ToolTip type="generic" message={"You must be logged in to +Rep"}>
                    <div className={gradientCSS}>
                        <FaPlus className="text-purple-500 inline -mr-0.5 pb-1.5"/>
                        Rep { reputation?.repped }
                    </div>
                </ToolTip>
            </div>
        )
    }

    return (
        <div className={`text-center text-sm m-2 font-semibold ${ hasAlreadyRepped ? "hover:text-red-400" : ""}`}
            onClick={() => handleRep(hasAlreadyRepped ? "remove" : "add")}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
        >
            <ToolTip type="generic" message={`${hasAlreadyRepped ? "Remove +Rep" : "Give +Rep"}`}>
                <div className={gradientCSS}>
                    { isMouseOver && hasAlreadyRepped && <FaMinus className="inline -mr-0.5 pb-1.5" /> }
                    { !(isMouseOver && hasAlreadyRepped) && <FaPlus className={`${ hasAlreadyRepped ? "text-blue-500" : "text-purple-500" } inline -mr-0.5 pb-1.5`} /> }
                    Rep {reputation?.repped}
                </div>
            </ToolTip>    
        </div>
    );
}