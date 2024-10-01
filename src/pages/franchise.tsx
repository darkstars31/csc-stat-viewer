import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { Link, useRoute } from "wouter";
import { Loading } from "../common/components/loading";
import { PlayerRow } from "./franchise/player-row";
import { franchiseImages } from "../common/images/franchise";
import { FranchiseManagementNamePlate } from "./franchises/franchiseManagementNamePlate";

export const COLUMNS = 4;

export function Franchise() {
	const { players, franchises = [], tiers, loading } = useDataContext();
	const [, params] = useRoute("/franchises/:franchiseName");
	const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
	const currentFranchise = franchises.find(f => f.name === franchiseName);

	if (loading.isLoadingFranchises) {
		return (
			<Container>
				<Loading />
			</Container>
		);
	}

	return (
		<div
			style={{
				backgroundImage: `url(${franchiseImages[currentFranchise?.prefix ?? ""]})`,
				overflow: "auto",
			}}
			className={`bg-repeat bg-center bg-fixed`}
		>
			<div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] overflow-auto">
				<Container>
					<div className="float-left h-24 w-24 md:w-48 md:h-48 relative">
						<img
							className="absolute h-full w-full"
							src={franchiseImages[currentFranchise?.prefix ?? ""]}
							placeholder=""
							alt=""
						/>
					</div>
					<div className="pt-2 grow">
						<h2 className="text-5xl font-bold text-white grow text-center">
							{currentFranchise?.name} (<i>{currentFranchise?.prefix}</i>)
						</h2>
						<div className="flex flex-row gap-8 justify-center text-center p-4 text-xl">
							<FranchiseManagementNamePlate player={players.find(p => p.name === currentFranchise?.gm.name)!} title="General Manager"/>
							{(currentFranchise?.agms ?? []).map( agm => 
									<FranchiseManagementNamePlate player={players.find(p => p.name === agm?.name)!} title="Asst. GM"/>
								)
							}
						</div>
						<div className="grid grid-cols-1 gap-4 p-1 text-sm text-gray-300">
							{currentFranchise?.teams.map(team => (
								<div key={`${team.tier.name}`} className="">
									<Link to={`/franchises/${currentFranchise.name}/${team.name}`}>
										<div className="m-2 border-b-[1px] hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-y-1 duration-300">
											<h2 className="text-xl w-full">
												<div className="inline font-extrabold">{team.name}</div>{" "}
												<span
													className={`text-gray-400 italic text-${tiers?.find(item => item.tier.name === team.tier.name)?.tier.color ?? ""}-400`}
												>
													{team.tier.name}{" "}
													{false && (
														<span className="text-xs">
															({team.players.reduce((cum, player) => cum + player.mmr, 0)}
															/{team.tier.mmrCap})
														</span>
													)}
												</span>
											</h2>
										</div>
									</Link>
									<div className="mx-4 px-2">
										{team.players.map(player => (
											<PlayerRow
												key={`${team.tier.name}-${player.name}`}
												franchisePlayer={player}
												team={team}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</Container>
			</div>
		</div>
	);
}
