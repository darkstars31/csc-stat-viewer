import * as React from "react";
import { Loading } from "../../common/components/loading";
import { useDataContext } from "../../DataContext";
import { usePickemsSearch } from "../../dao/analytikill";
import { GiChoice } from "react-icons/gi";

interface PlayerPickemsExplorerProps {
    seasonId: number;
    onBackToMyPickems: () => void;
}

export const PlayerPickemsExplorer: React.FC<PlayerPickemsExplorerProps> = ({ seasonId, onBackToMyPickems }) => {
    const { data: pickemsSearchData, isLoading: isLoadingPickemsSearch } = usePickemsSearch(seasonId, { enabled: true });
    const { players } = useDataContext();

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <GiChoice size={"1.5rem"} className="inline mr-2" /> 
                    Explore Players Pickems
                </h2>
                <button 
                    onClick={onBackToMyPickems}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to My Pickems
                </button>
            </div>

            {isLoadingPickemsSearch ? (
                <div className="flex justify-center items-center py-8">
                    <Loading />
                </div>
            ) : pickemsSearchData && pickemsSearchData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pickemsSearchData.map((player) => {
                        const cscPlayer = players.find(p => p.discordId === player.discordId);
                        return (
                            <button 
                                key={player.discordId}
                                onClick={() => {
                                    // TODO: Implement viewing another player's pickems
                                    console.log(`View ${player.username}'s pickems`);
                                }}
                                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100"
                            >
                                {cscPlayer?.avatarUrl && (
                                    <img 
                                        src={cscPlayer.avatarUrl} 
                                        alt={cscPlayer.name} 
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div className="text-left">
                                    <div className="font-medium">{cscPlayer?.name || player.username}</div>
                                    <div className="text-xs text-gray-600">Tier: {player.tier || "Unknown"}</div>
                                </div>
                                <div className="ml-auto text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>
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
