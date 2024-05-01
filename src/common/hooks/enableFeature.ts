import * as React from "react";
import { useDataContext } from "../../DataContext";

const isIn = (evaluate?: string, array?: string | string[]) => (Array.isArray(array) ? array : [array]).map( i => atob(i ?? "")).includes(evaluate || "");


export const useEnableFeature = ( featureString: string ) => {
    const [enabled, setEnabled] = React.useState(false);
    const { loggedinUser } = useDataContext();

    React.useEffect(() => {
        const rules = [
            { name: "canUsePlayerComparison", function: () => isIn( loggedinUser?.team?.franchise.prefix, 'V0VU') || isIn( loggedinUser?.steam64Id, ['NzY1NjExOTgxNjk5MzM4Nzg=','NzY1NjExOTc5ODcwMTU0NjA=','NzY1NjExOTgxMDcxNTY4MjA=','NzY1NjExOTc5ODcwMTU0NTg='])},
        ];
    
        const rule = rules.find( r => r.name === featureString );
        if( rule ){
            setEnabled( rule.function() );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return enabled;

}