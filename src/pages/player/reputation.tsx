import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { useDataContext } from "../../DataContext";
import { useFetchReputation } from "../../dao/analytikill";
import cookie from "js-cookie";
import { queryClient } from "../../App";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export function Reputation( { playerDiscordId }: { playerDiscordId: string | undefined } ) {
    const { discordUser } = useDataContext();
    const { data: reputation = undefined, isLoading } = useFetchReputation( playerDiscordId );

    const hasAlreadyRepped = Object.keys(reputation?.plusRep ?? {}).includes(discordUser?.id ?? "");

    if (isLoading || !playerDiscordId) {
        return <div className="mx-auto animate-spin h-[1em] w-[1em] mt-2">
            <AiOutlineLoading3Quarters />
        </div>;
    }

    const handleRep = async ( action:  "add" | "remove") => {
        await fetch(`https://tonysanti.com/prx/csc-stat-api/analytikill/plusRep`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + cookie.get("jwt"),
                "content-type": "application/json",
            },
            body: JSON.stringify({ action, discordId: playerDiscordId }),
        }).then( () => {
            queryClient.invalidateQueries(["Reputation", playerDiscordId]);
        });
    };

    if ( !discordUser ){
        return (
            <div className="text-center text-sm m-2 text-blue-500 font-semibold">
                <ToolTip type="generic" message={"You must be logged in to +Rep"}>
                    <FaPlus className="inline -mr-0.5"/>
                    Rep { reputation?.repped }
                </ToolTip>
            </div>
        )
    }

    return (
        <div className={`text-center text-sm m-2 text-blue-500 ${ hasAlreadyRepped ? "hover:text-red-500" : ""} font-semibold`}
            onClick={() => handleRep(hasAlreadyRepped ? "remove" : "add")}
        >
            <ToolTip type="generic" message={`${hasAlreadyRepped ? "Remove +rep" : "Give +rep"}`}>
                <FaPlus className="inline -mr-0.5"/>
                Rep {reputation?.repped }
            </ToolTip>    
        </div>
    );
}