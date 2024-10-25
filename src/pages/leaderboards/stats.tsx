import * as React from "react";
import { Card } from "../../common/components/card";
import { Player } from "../../models";
import { Link } from "wouter";

type Props = {
	title: string;
	subtitle?: string;
	header?: boolean;
	headerImage?: string;
	rows: {
		player: Player;
		value: string | number; //Record<string, React.ReactNode | string | number | null | undefined>[]
	}[];
};

const tiers = [
	{ name: "Recruit", color: "text-red-400"},
	{ name: "Prospect", color: "text-orange-400"},
	{ name: "Contender", color: "text-yellow-400",},
	{ name: "Challenger", color: "text-green-400",},
	{ name: "Elite", color: "text-blue-400",},
	{ name: "Premier", color: "text-purple-400",},
];

export function StatsLeaderBoard({ title, subtitle, rows, header = true, headerImage }: Props) {
	return (
		<div className="basis-1/4 grow">
			<Card className="min-h-[304px]">
				<div className="text-center text-xl uppercase font-extrabold m-2">
					<div className="flex flex-row justify-center">
						<div className="">
						{title}	
						{ subtitle && <div className="text-xs text-center text-gray-500">{subtitle}</div>}
						</div>			
						{headerImage && (
							<div className="w-24 h-16 pl-4 inline">
								<img className="inline" src={headerImage} alt="icon" />
							</div>
						)}
					</div>
				</div>
				<div className="overflow-hidden overflow-x-auto rounded">
					<table className="table-auto min-w-full text-sm">
						{header && (
							<thead className="text-left underline decoration-yellow-400">
								<tr>
									<td>Name</td>
									<td>Tier</td>
									<td></td>
								</tr>
							</thead>
						)}

						<tbody>
							{rows.map((row, rowIndex) =>
								rowIndex === 0 ?
									<tr
										className={`${rowIndex % 2 === 1 ? "bg-midnight1" : "bg-midnight2"} rounded h-16`}
									>
										<td>
											<div className="relative pl-2 font-xl font-bold truncate hover:text-blue-400">
												<Link to={`/players/${encodeURIComponent(row.player.name)}`}>
													<img
														className="inline h-12 w-12 rounded-full mr-2"
														src={row.player.avatarUrl}
														alt="Discord Avatar"
													/>
													{row.player.name}
												</Link>
											</div>
										</td>
										<td className={`${tiers.find(t => t.name === row.player.tier.name)?.color}`}>{row.player.tier.name}</td>
										<td className="font-black">{row.value}</td>
									</tr>
								:	<tr
										className={`${rowIndex % 2 === 1 ? "bg-midnight1" : "bg-midnight2"} rounded px-4 py-1 font-medium`}
									>
										<td
											className={`whitespace-nowrap pl-2 py-1 font-medium truncate hover:text-blue-400`}
										>
											<Link to={`/players/${encodeURIComponent(row.player.name)}`}>
												{row.player.name}
											</Link>
										</td>
										<td className={`whitespace-nowrap py-1 font-medium ${tiers.find(t => t.name === row.player.tier.name)?.color}`}>{row.player.tier.name}</td>
										<td className={`whitespace-nowrap py-1 font-medium`}>{row.value}</td>
									</tr>,
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
