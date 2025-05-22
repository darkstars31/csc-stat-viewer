import * as React from 'react';
import { useDataContext } from '../DataContext';
import { useCscPlayersGraph } from '../dao/cscPlayerGraphQLDao';
import { PlayerTypes } from '../common/utils/player-utils';
import { queryClient } from '../App';
import { Container } from '../common/components/container';

export const Draft = () => {
    const { players, loggedinUser } = useDataContext();
    const { data = [], isLoading } = useCscPlayersGraph(PlayerTypes.DRAFT_ELIGIBLE, { skipCache: true, ttl: 5000, queryKeyOverride: "draftplayers" });

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [targetPlayers, setTargetPlayers] = React.useState<string[]>([]);
    const [playerInput, setPlayerInput] = React.useState('');
   
    React.useEffect(() => {
        if (isRefreshing) {
            setInterval(() => {
                queryClient.invalidateQueries({ queryKey:[`draftplayers`]});
            }, 10000);
        }
    });

    const premierPlayers = React.useMemo(() => {
        return data
            .filter(p => p.tier.name === "Premier")
            .sort((a, b) => b.mmr - a.mmr);
    }, [data]);

    const isPlayerInData = (playerName: string) => {
        return data.some(player => player.name.toLowerCase() === playerName.toLowerCase());
    };

    const addPlayerTarget = () => {
        if (playerInput && !targetPlayers.includes(playerInput)) {
            setTargetPlayers([...targetPlayers, playerInput]);
            setPlayerInput('');
        }
    };

    const removePlayerTarget = (playerName: string) => {
        setTargetPlayers(targetPlayers.filter(name => name !== playerName));
    };

    return (
        <Container>
            <h1 className="text-4xl font-bold">Draft</h1>
            <p className="mt-4 text-lg">Welcome to the draft page!</p>
            {loggedinUser && <p className="mt-2">Logged in as: {loggedinUser.name}</p>}
            
            {/* Player Target Input */}
            <div className="mt-6 mb-4">
                <h2 className="text-2xl font-bold mb-2">Player Targets</h2>
                <div className="flex gap-2">
                    <select
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        className="border p-2 rounded text-black bg-white"
                    >
                        <option value="">Select a player</option>
                        {premierPlayers.map(player => (
                            <option key={player.id} value={player.name}>
                                {player.name} (MMR: {player.mmr})
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={addPlayerTarget} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={!playerInput}
                    >
                        Add Player
                    </button>
                </div>
                
                {/* Target Players List */}
                {targetPlayers.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Your Targets:</h3>
                        <div className="flex flex-wrap gap-2">
                            {targetPlayers.map((playerName, index) => {
                                const isInData = isPlayerInData(playerName);
                                return (
                                    <div 
                                        key={index}
                                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${isInData ? 'bg-green-100' : 'bg-red-200'}`}
                                    >
                                        <span className='text-gray-600'>{playerName}</span>
                                        <button 
                                            onClick={() => removePlayerTarget(playerName)}
                                            className="text-sm font-bold text-gray-500 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400 mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">ID</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">MMR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter(p => p.tier.name === "Premier")
                            .sort((a, b) => b.mmr - a.mmr)
                            .map(player => (
                                <tr key={player.steam64Id} className="text-sm">
                                    <td className="border border-gray-400 px-2 py-1">{player.id}</td>
                                    <td className="border border-gray-400 px-2 py-1">{player.name}</td>
                                    <td className="border border-gray-400 px-2 py-1">{player.mmr}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}