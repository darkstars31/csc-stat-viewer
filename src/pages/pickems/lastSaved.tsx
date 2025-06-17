import * as React from "react";
import dayjs from "dayjs";

type Props = {
    dateUpdated?: string | null;
}

export const LastSaved = ({ dateUpdated }: Props) => {
    const [_, setTimeUpdateTrigger] = React.useState(0);

    // Add this effect to update the time display every minute
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeUpdateTrigger(prev => prev + 1);
        }, 60000);
        
        return () => clearInterval(timer);
    }, []);
    
    return (
        <div className="text-xs font-extrabold uppercase text-gray-500">
            Picks last saved {dateUpdated ? dayjs(dateUpdated).fromNow() : "Never"}
        </div>
    )
}

