import * as React from "react";
import { CscStats, Player } from "../../models";
import { Card } from "../../common/components/card";
import { getCssColorGradientBasedOnPercentage } from "../../common/utils/string-utils";
import { useDataContext } from "../../DataContext";
import { getPlayerPercentileStatInTier } from "../../common/utils/player-utils";
import { Toggle } from "../../common/components/toggle";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "wouter";

export function ComparisonTable({ selectedPlayers }: { selectedPlayers: Player[] }) {
	const [showPercentile, setShowPercentile] = React.useState(false);
	const { players, tiers } = useDataContext();

	const selectedPlayersWithPercentile = React.useMemo(
		() =>
			Array.from(selectedPlayers.filter(p => p.stats).values()).map(p => ({
				...p,
				percentile: Object.assign(
					{},
					...Object.keys(p.stats).map(key => {
						return {
							[key]: +getPlayerPercentileStatInTier(p, players, key as keyof CscStats),
						};
					}),
				),
			})),
		[selectedPlayers, players],
	);

	const currentTierMMRCap = tiers.find(
		t => t.tier.name === selectedPlayers[0]?.tier.name,
	);
	const totalMMR = selectedPlayers.reduce((accumulator, player) => accumulator + (player?.mmr ?? 0), 0);
	const overCap = totalMMR > (currentTierMMRCap?.tier.mmrCap ?? 0);

	return (
		<Card>
			<div className="flex flex-row justify-end m-1 text-sm">
				<Toggle checked={showPercentile} onChange={() => setShowPercentile(!showPercentile)} />
				Show Percentiles
			</div>
			<div className="w-full flex flex-row">
				<table className="table-auto w-full font-light">
					<thead className="text-left underline decoration-yellow-400">
						<tr>
							<td>Name</td>						
							<td>Role</td>
							<td>
								MMR{" "}
								<span className={`${overCap ? "text-red-500" : ""}`}>
									({((totalMMR / (currentTierMMRCap?.tier.mmrCap || 1)) * 100).toFixed(1)}% Cap)
								</span>
							</td>
							<td>Games</td>
							<td>Rating</td>
							<td>Pit</td>
							<td>KAST</td>
							<td>ADR</td>
							<td>K/R</td>
							<td>HS%</td>
							<td>UtilDmg</td>
							<td>EF</td>
						</tr>
					</thead>
					<tbody>
						{Array.from(selectedPlayersWithPercentile).map((player, rowIndex) => (
							<tr
								key={player.name.concat(player.tier.name)}
								className={`${rowIndex % 2 === 1 ? "bg-midnight1" : "bg-midnight2"} rounded h-8`}
							>
								<td>
									{player.team?.franchise.prefix ?? ""} {player.name}{" "}
									<Link
										className="inline hover:text-blue-400"
										target="_blank"
										rel="noreferrer"
										href={`/players/${encodeURIComponent(player.name)}`}
									>
										<FaExternalLinkAlt size={12} className="inline leading-4" />
									</Link>
								</td>
								<td>{player.role}</td>
								<td>
									{player.mmr !== 0 ? player.mmr : "???"}{" "}
									{player.mmr && currentTierMMRCap && (
										<span>
											({((player.mmr / (currentTierMMRCap.tier.mmrCap || 1)) * 100).toFixed(1)}
											%)
										</span>
									)}
								</td>
								<td>{player.stats.gameCount}</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.rating)}`}>
									{(showPercentile ? player.percentile : player.stats)["rating"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.pit)}`}>
									{(showPercentile ? player.percentile : player.stats)["pit"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.kast)}`}>
									{(showPercentile ? player.percentile : player.stats)["kast"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.adr)}`}>
									{(showPercentile ? player.percentile : player.stats)["adr"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.kr)}`}>
									{(showPercentile ? player.percentile : player.stats)["kr"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.hs)}`}>
									{(showPercentile ? player.percentile : player.stats)["hs"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.utilDmg)}`}>
									{(showPercentile ? player.percentile : player.stats)["utilDmg"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
								<td className={`${getCssColorGradientBasedOnPercentage(player.percentile.ef)}`}>
									{(showPercentile ? player.percentile : player.stats)["ef"].toFixed(
										showPercentile ? 0 : 2,
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	);
}
