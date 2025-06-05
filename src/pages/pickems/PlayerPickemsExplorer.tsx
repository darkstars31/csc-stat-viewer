import * as React from "react";
import { Loading } from "../../common/components/loading";
import { useDataContext } from "../../DataContext";
import { usePickems, usePickemsSearch } from "../../dao/analytikill";
import { GiChoice } from "react-icons/gi";
import { useRoute, useSearch } from "wouter";

interface PlayerPickemsExplorerProps {
    onBackToMyPickems: () => void;
}

type PlayersPickems =    {
  "discordId": string,
  "tier": "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier",
  "season": number
}

export const PlayerPickemsExplorer: React.FC<PlayerPickemsExplorerProps> = ({ onBackToMyPickems }) => {
    const { seasonAndMatchType } = useDataContext();
    const queryParams = new URLSearchParams(useSearch());
    const [, params] = useRoute("/pickems/:id");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const { data: pickemsData } = usePickems()
    const { data: pickemsSearchData, isLoading: isLoadingPickemsSearch } = usePickemsSearch<PlayersPickems[]>(seasonAndMatchType.season, { enabled: false });
    const { players } = useDataContext();


    console.info(pickemsSearchData, "Pickems Search Data from DAO");

    const playersWithPickems = players.filter( p => pickemsSearchData?.find(pd => pd.discordId === p.discordId))

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <GiChoice size={"1.5rem"} className="inline mr-2" /> 
                    Explore Players Pickems
                </h2>         
            </div>
            { !playersWithPickems.length && 
                <div className="text-center flex justify-center items-center py-8 text-xl text-gray-500 uppercase font-bold">
                    This feature is not finished yet. Please check back later!
                    <button 
                        onClick={onBackToMyPickems}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                    Back to My Pickems
                    </button>
                </div>
            }
            {isLoadingPickemsSearch ? (
                <div className="text-center flex justify-center items-center py-8">
                    <Loading />
                </div>
            ) : playersWithPickems ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    { playersWithPickems.map(cscPlayer => {
                        return (
                            <a
                                key={cscPlayer.discordId}
                                href={`/pickems/${encodeURIComponent(cscPlayer.name)}`} // Link to player's pickems
                                className="p-2 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 bg-gradient-to-r from-gray-300 to-gray-500 hover:from-blue-400 hover:to-blue-400"
                            >
                                {cscPlayer?.avatarUrl && (
                                    <img 
                                        src={cscPlayer.avatarUrl} 
                                        alt={cscPlayer.name} 
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div className="text-left">
                                    <div className="font-medium">{cscPlayer?.name}</div>
                                    <div className="text-xs text-gray-600 uppercase font-extrabold">{cscPlayer?.tier.name || "Unknown"}</div>
                                </div>
                                <div className="ml-auto text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </a>
                        );
                    })}
                </div>
            ) : nameParam ? (
                <>
                </>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <div className="text-gray-500 mb-2">No player data available</div>
                    <p className="text-sm text-gray-400">This feature is currently under development.</p>
                    <p className="mt-4">
                        <button 
                            onClick={onBackToMyPickems}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Back to My Pickems
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};
