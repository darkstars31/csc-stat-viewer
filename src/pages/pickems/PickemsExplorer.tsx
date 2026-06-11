import * as React from "react";
import { Loading } from "../../common/components/loading";
import { useDataContext } from "../../DataContext";
import { usePickems, usePickemsMatchUpConsensus, usePickemsSearch } from "../../dao/analytikill";
import { GiChoice } from "react-icons/gi";
import { Link, useRoute, useSearch } from "wouter";
import { Container } from "../../common/components/container";
import { WeeklyPickems } from "./WeeklyPickems";
import { LastSaved } from "./lastSaved";
import { useFetchMatchesGraph } from "../../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { matchesByMatchDay } from "./utils";
import { TimeframeToggle } from "./TimeframeToggle";
import { Match } from "../../models/matches-types";
import { FaArrowLeft } from "react-icons/fa";

type PlayersPickems =    {
  "discordId": string,
  "tier": "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier",
  "season": number
}

const tierColors: Record<string, { bg: string; text: string; activeBg: string }> = {
    Recruit:    { bg: "bg-red-950",    text: "text-red-400",    activeBg: "bg-red-700" },
    Prospect:   { bg: "bg-orange-950", text: "text-orange-400", activeBg: "bg-orange-700" },
    Contender:  { bg: "bg-yellow-950", text: "text-yellow-400", activeBg: "bg-yellow-700" },
    Challenger: { bg: "bg-green-950",  text: "text-green-400",  activeBg: "bg-green-700" },
    Elite:      { bg: "bg-blue-950",   text: "text-blue-400",   activeBg: "bg-blue-700" },
    Premier:    { bg: "bg-purple-950", text: "text-purple-400", activeBg: "bg-purple-700" },
};

export const PickemsExplorer: React.FC = () => {
    const { seasonAndMatchType, players } = useDataContext();
    const { data: pickemsSearchData, isLoading: isLoadingPickemsSearch } = usePickemsSearch<PlayersPickems[]>(seasonAndMatchType.season, { enabled: true });
    const { data: matches = [], isLoading } = useFetchMatchesGraph(seasonAndMatchType.season, undefined, { enabled: seasonAndMatchType.season > 0});
    const queryParams = new URLSearchParams(useSearch());
    const [, params] = useRoute("/pickems/explorer/:id");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const player = players.find(p => p.name === nameParam);
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<string[]>(['past','current']);
    const { data: pickemsConcensusData, isLoading: isLoadingPickemsConsensus } = usePickemsMatchUpConsensus(seasonAndMatchType.season, { enabled: !!(player?.discordId && seasonAndMatchType.season > 0) });
    
    const [ userTier, setUserTier ] = React.useState<string | undefined>(player?.tier.name);
    
    const { data: pickemsData } = usePickems( player?.discordId, seasonAndMatchType.season, { enabled: !!player });
    const currentDate = dayjs()

    React.useEffect(() => {
        if (pickemsData?.tier) {
            setUserTier(pickemsData.tier);
        } else if (player?.tier?.name) {
            setUserTier(player.tier.name);
        }
    }, [pickemsData, player]);

    const playersWithPickems = players.filter( p => pickemsSearchData?.find(pd => pd.discordId === p.discordId))

    const matchesByMatchday = matchesByMatchDay(matches, userTier);
    
        const pastMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) => 
            dayjs(matchDate).isBefore(currentDate, 'week')
        );
        const currentMatchWeek = Object.keys(matchesByMatchday).filter((matchDate) => 
            dayjs(matchDate).isSame(currentDate, 'week')
        );
        const futrueMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) =>
            dayjs(matchDate).isAfter(currentDate, 'week')
        );

    return (
        <Container>
            <div className="h-fit">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold mr-2 flex items-center">
                            <GiChoice size={"1.5rem"} className="mr-2" />
                            Explore Players Pickems
                        </h1>
                        {["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"].map((tier) => {
                            const colors = tierColors[tier];
                            const isActive = userTier === tier;
                            return (
                                <button
                                    key={tier}
                                    onClick={() => setUserTier(tier)}
                                    className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${
                                        isActive
                                            ? `${colors.activeBg} ${colors.text}`
                                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                    }`}
                                >
                                    {tier}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            onClick={() => history.back()}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                            <FaArrowLeft size="1rem" />
                            Back
                        </div>
                        <TimeframeToggle selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} />
                    </div>
                </div>
                { isLoadingPickemsSearch ? (
                    <div className="text-center flex justify-center items-center py-8">
                        <Loading />
                    </div>
                ) : player && pickemsData ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">
                            {player.name}'s Weekly Pickems
                        </h1>
                        {/* {submitError && <ErrorMessage error={submitError} />} */}
                        <LastSaved dateUpdated={pickemsData?.dateUpdated} />
                        <div className="flex flex-col space-y-8">
                            {(() => {
                                const sorted = (Object.entries(matchesByMatchday) as [string, any[]][])
                                    .sort(([a], [b]) => b.localeCompare(a))
                                    .filter(([matchDate]) => {
                                        const isFuture = futrueMatchWeeks.includes(matchDate);
                                        if (isFuture) return selectedTimeframe.includes("future");
                                        return true;
                                    });

                                const pastEntries = sorted.filter(([matchDate]) => pastMatchWeeks.includes(matchDate));
                                const currentEntries = sorted.filter(([matchDate]) => currentMatchWeek.includes(matchDate));
                                const futureEntries = sorted.filter(([matchDate]) => futrueMatchWeeks.includes(matchDate));

                                const renderCard = ([matchDate, matches]: [string, Match[]]) => (
                                    <WeeklyPickems
                                        key={matchDate}
                                        matchDate={matchDate}
                                        matches={matches}
                                        selectedMatches={pickemsData.pickems}
                                        pickemsConcensusData={pickemsConcensusData}
                                        handleSelection={() => {}}
                                    />
                                );

                                return (
                                    <>
                                        {futureEntries.length > 0 && (
                                            <div className="flex flex-nowrap items-start gap-8 overflow-x-auto">
                                                {futureEntries.map(renderCard)}
                                            </div>
                                        )}
                                        <div className="flex flex-nowrap items-start gap-8 overflow-x-auto">
                                            {currentEntries.map(renderCard)}
                                            {pastEntries.map(renderCard)}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </>
                ) : playersWithPickems ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        { playersWithPickems.map(cscPlayer => {
                            return (
                                <Link
                                    key={cscPlayer.discordId}
                                    href={`/pickems/explorer/${encodeURIComponent(cscPlayer.name)}`}
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
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border">
                        <div className="text-gray-500 mb-2">No player data available</div>
                        <p className="text-sm text-gray-400">This feature is currently under development.</p>
                        <p className="mt-4">
                            <Link
                                href="/pickems"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Back to My Pickems
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </Container>
    );
};
