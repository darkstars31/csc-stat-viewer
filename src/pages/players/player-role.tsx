import * as React from "react";
import { rifler, awper, lurker, support, entry, fragger } from "../../svgs"


type Props = {
    role: string,
}

export function PlayerCardRole( { role }: Props) {
    return (
        <div>
        <div className="text-center">
            {role}
        </div>
        <div className="flex justify-center">
            {role === "RIFLER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${rifler}`} alt="Rifler"/>}
            {role === "AWPER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${awper}`} alt="Awper"/>}
            {role === "LURKER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${lurker}`} alt="Lurker"/>}
            {role === "SUPPORT" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${support}`} alt="Support"/>}
            {role === "ENTRY" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${entry}`} alt="Entry"/>}
            {role === "FRAGGER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${fragger}`} alt="Fragger"/>}
        </div>
    </div>
    );
}