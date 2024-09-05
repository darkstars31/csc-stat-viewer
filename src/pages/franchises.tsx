import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Link } from "wouter";
import { useDataContext } from "../DataContext";
import { franchiseImages } from "../common/images/franchise";
import { FranchiseTeams } from "./franchises/teams";
import { franchiseMetadata } from "../common/constants/franchiseMetadata";
import { BiSolidTrophy } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

export function Franchises() {
	const { franchises = [], tiers, loading } = useDataContext();

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
			<div className="flex flex-row gap-4 m-auto text-xs my-3">
				<div className="grow text-center">
					<div className={`font-bold`}>Franchises</div>
					<div>{franchises.length}</div>
				</div>
				{Object.keys(teamCounts)
					.reverse()
					.map(key => (
						<div className="grow">
							<div
								className={`font-bold capitalize text-${tiers?.find(item => item.tier.name.toLowerCase() === key)?.tier.color ?? ""}-400`}
							>
								{key}
							</div>
							<div>{teamCounts[key as keyof typeof teamCounts] ?? 0} Teams</div>
						</div>
				))}
				<div className="justify-end">
					<div><a className="text-blue-500" href="https://docs.google.com/spreadsheets/d/1kYFEE7M8WlklES2NtWwmP3Ri2qj8zKTdv5qQN2UAPh4/edit?usp=drivesdk" target="_blank">Franchise and GM History <FaExternalLinkAlt className="inline" /></a></div>
					<div><a className="text-blue-500" href="https://docs.google.com/spreadsheets/d/1P_i1_RQwu-x3GZ9KMpZNbgtHl2L99YBbTLDKNJbXf7E/edit?usp=drivesdk" target="_blank">Franchise Championships <FaExternalLinkAlt className="inline" /></a></div>
				</div>
			</div>
			{loading.isLoadingFranchises && <Loading />}
			<div className="flex flex-col gap-4">
				{franchises.map(franchise => (
					<div
						key={`${franchise.name}`}
						className="relative hover:cursor-pointer shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
					>				
						<Link to={`/franchises/${encodeURIComponent(franchise.name)}`}>
							<div
								style={{
									backgroundImage: `url(${franchiseImages[franchise.prefix]})`,
								}}
								className={`bg-repeat bg-fixed bg-center`}
							>
								<div className="rounded-md border border-gray-800 md:flex-row overflow-hidden backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] p-2">
									<div className="flex flex-row">
										<div>
											<div className="z-10 h-24 w-24 md:w-48 md:h-48">
												<img
													src={franchiseImages[franchise.prefix]}
													placeholder=""
													alt=""
												/>
												<div className="text-sm text-yellow-300">
													{ franchiseMetadata.find( f => f.prefix === franchise.prefix )?.trophies.map( t => (
														<div>{t.season} <BiSolidTrophy className="inline" /> {t.tier}</div>
													))}
												</div>
											</div>
										</div>
										<div>
											<div className="basis-8/12 flex flex-row gap-8 justify-end">
												<div className="basis-1/3 text-3xl font-bold text-white text-center leading-loose">
													{franchise.name} (<i>{franchise.prefix}</i>)
												</div>
												<div className="basis-1/2">
													<div>GM - {franchise.gm.name}</div>
													<div>AGM - {franchise.agms?.map(agm => agm.name).join(", ")}</div>
												</div>
											</div>
											<FranchiseTeams franchise={franchise} />
										</div>
									</div>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</Container>
	);
}
