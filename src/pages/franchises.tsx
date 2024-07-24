import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Link } from "wouter";
import { useKonamiCode } from "../common/hooks/konami";
import { useDataContext } from "../DataContext";
import { GiPirateHat } from "react-icons/gi";
import { franchiseImages } from "../common/images/franchise";
import { PlayerTypes } from "../common/utils/player-utils";
// import { Mmr } from "../common/components/mmr";

export function Franchises() {
	const konami = useKonamiCode();
	const { franchises = [], players = [], seasonAndTierConfig, loading } = useDataContext();

	const tierNumber = {
		Recruit: 1,
		Prospect: 2,
		Contender: 3,
		Challenger: 4,
		Elite: 5,
		Premier: 6,
	};

	const teamCounts = {
		recruit: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Recruit") ? 1 : 0),
			0,
		),
		prospect: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Prospect") ? 1 : 0),
			0,
		),
		contender: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Contender") ? 1 : 0),
			0,
		),
		challenger: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Challenger") ? 1 : 0),
			0,
		),
		elite: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Elite") ? 1 : 0),
			0,
		),
		premier: franchises.reduce(
			(acc, franchise) => acc + (franchise.teams?.find(t => t.tier.name === "Premier") ? 1 : 0),
			0,
		),
	};

	return (
		<Container>
			<div className="mx-auto max-w-lg text-center">
				<h2 className="text-3xl font-bold sm:text-4xl">Franchises & Teams</h2>
				<p className="mt-4 text-gray-300">Current Teams and players on those teams + roles.</p>
			</div>
			<div className="flex flex-row gap-4 m-auto text-center text-xs">
				<div className="grow">
					<div className={`font-bold`}>Franchises</div>
					<div>{franchises.length}</div>
				</div>
				{Object.keys(teamCounts)
					.reverse()
					.map(key => (
						<div className="grow">
							<div
								className={`font-bold capitalize text-${seasonAndTierConfig?.league?.leagueTiers?.find(item => item.tier.name.toLowerCase() === key)?.tier.color ?? ""}-400`}
							>
								{key}
							</div>
							<div>{teamCounts[key as keyof typeof teamCounts] ?? 0} Teams</div>
						</div>
					))}
			</div>
			{loading.isLoadingFranchises && <Loading />}
			{franchises.map(franchise => (
				<div
					key={`${franchise.name}`}
					className="hover:cursor-pointer my-4 block bg-midnight2 rounded-xl border border-gray-800 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
				>
					<Link to={`/franchises/${encodeURIComponent(franchise.name)}`}>
						<div
							style={{
								backgroundImage: `url(${franchiseImages[franchise.prefix]})`,
							}}
							className={`bg-repeat bg-fixed bg-center`}
						>
							<div className="flex flex-col md:flex-row justify-between overflow-hidden backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85]">
								<div className="-mr-2 pt-4 h-24 w-24 md:w-36 md:h-36 relative">
									<img
										className="absolute h-full w-full"
										src={franchiseImages[franchise.prefix]}
										placeholder=""
										alt=""
									/>
								</div>
								<div className="pt-2 grow">
									<div className="flex flex-row gap-8 justify-center">
										<div className="basis-1/2 text-3xl font-bold text-white text-center leading-loose">
											{franchise.name} (<i>{franchise.prefix}</i>)
										</div>
										<div className="basis-1/2">
											<div>GM - {franchise.gm.name}</div>
											<div>AGM - {franchise.agms?.map(agm => agm.name).join(", ")}</div>
										</div>
									</div>
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 p-1 text-sm text-gray-300">
										{franchise.teams
											.sort(
												(a, b) =>
													tierNumber[b.tier.name as keyof typeof tierNumber] -
													tierNumber[a.tier.name as keyof typeof tierNumber],
											)
											.map(team => (
												<div key={`${team.tier.name}`}>
													<div className="mx-4 border-b-[1px] border-slate-700 text-center">
														<strong>{team.name}</strong>{" "}
														<span
															className={`text-gray-400 italic text-${seasonAndTierConfig?.league?.leagueTiers?.find(item => item.tier.name === team.tier.name)?.tier.color ?? ""}-400`}
														>
															{team.tier.name}{" "}
															{konami && (
																<span className="text-xs">
																	{" "}
																	(
																	{team.players.reduce(
																		(cum, player) => cum + player.mmr,
																		0,
																	)}
																	/{team.tier.mmrCap})
																</span>
															)}
														</span>
													</div>
													<div className="mx-4 px-2">
														{team.players.map(player => {
															const playerWithStats = players.find(
																p => p.steam64Id === player.steam64Id,
															);
															const isInactiveReserve =
																playerWithStats?.type === PlayerTypes.INACTIVE_RESERVE;

															return (
																<div
																	key={`${team.tier.name}-${player.name}`}
																	className={`${isInactiveReserve ? "text-slate-500" : ""} m-1 grid grid-cols-3 gap-2`}
																>
																	<div>
																		{player.name}{" "}
																		{isInactiveReserve ?
																			<span>(IR)</span>
																		:	""}{" "}
																		{team?.captain?.steam64Id === player.steam64Id ?
																			<GiPirateHat
																				size="1.5em"
																				className="inline"
																			/>
																		:	""}
																	</div>
																	<div className="text-center">
																		{playerWithStats?.stats?.rating.toFixed(2)}
																	</div>
																	<div>{playerWithStats?.role}</div>
																	{/* <div className="text-xs text-gray-500"> <span className="hidden md:contents"><Mmr player={player} />({((player.mmr/team.tier.mmrCap)*100).toFixed(1)}%)</span></div> */}
																</div>
															);
														})}
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
					</Link>
				</div>
			))}
		</Container>
	);
}
