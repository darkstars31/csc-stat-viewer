import { Menu, Transition } from "@headlessui/react";
import * as React from "react";
import { discordLogin, discordSignOut } from "../dao/oAuth";
import { RxDiscordLogo } from "react-icons/rx";
import { useDataContext } from "../DataContext";
import { Link } from "wouter";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export function HeaderProfile() {
	const { discordUser, players, enableExperimentalHistorialFeature, setEnableExperimentalHistorialFeature } = useDataContext();
	const currentLoggedInPlayer = players.find(p => p.discordId === discordUser?.id);

	return (
		<Menu as="div" className="relative inline-block text-left">
			{!discordUser && (
				<button
					className="flex p-2 rounded hover:bg-blue-600 bg-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
					onClick={() => {
						discordLogin();
					}}
				>
					<RxDiscordLogo size="1.5em" aria-hidden="true" />
					<span className="ml-2">Login</span>
				</button>
			)}

			{discordUser && (
				<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
					<span className="sr-only">Open user menu</span>
					<img
						className="h-8 w-8 rounded-full"
						src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`}
						alt=""
					/>
				</Menu.Button>
			)}
			<Transition
				as={React.Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">	
					<Menu.Item>
						{({ active }) => (
							<Link to={`/profile`}>
								<button
									className={classNames(
										active ? "bg-gray-100" : "",
										"block px-4 py-2 text-sm text-gray-700 w-full",
									)}
								>
									My Profile
								</button>
							</Link>
						)}
					</Menu.Item>
					{currentLoggedInPlayer && (
						<>
							<Menu.Item>
								{({ active }) => (
									<Link to={`/players/${currentLoggedInPlayer?.name}`}>
										<button
											className={classNames(
												active ? "bg-gray-100" : "",
												"block px-4 py-2 text-sm text-gray-700 w-full",
											)}
										>
											My Stats
										</button>
									</Link>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<Link
										to={`/franchises/${currentLoggedInPlayer?.team?.franchise.name}/${currentLoggedInPlayer?.team?.name}`}
									>
										<button
											className={classNames(
												active ? "bg-gray-100" : "",
												"block px-4 py-2 text-sm text-gray-700 w-full",
											)}
										>
											My Team
										</button>
									</Link>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<Link to={`/franchises/${currentLoggedInPlayer?.team?.franchise.name}`}>
										<button
											className={classNames(
												active ? "bg-gray-100" : "",
												"block px-4 py-2 text-sm text-gray-700 w-full",
											)}
										>
											My Franchise
										</button>
									</Link>
								)}
							</Menu.Item>
							<hr />
							<Menu.Item>
								{({ active }) => (
									<Link to={`/servers`}>
										<button
											className={classNames(
												active ? "bg-gray-100" : "",
												"block px-4 py-2 text-sm text-gray-700 w-full",
											)}
										>
											Request Server
										</button>
									</Link>
								)}
							</Menu.Item>
							<hr />
						</>
					)}
					<Menu.Item>
						{({ active }) => (									
							<button
								className={classNames(
									active ? "bg-gray-100" : "",
									"block px-4 py-2 text-sm text-gray-700 w-full",
								)}
								onClick={() => {
									setEnableExperimentalHistorialFeature(!enableExperimentalHistorialFeature);
								}}
							>
								{enableExperimentalHistorialFeature ? "Disable" : "Enable"} Experimental History
							</button>								
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<button
								className={classNames(
									active ? "bg-gray-100" : "",
									"block px-4 py-2 text-sm text-gray-700",
									"w-full",
								)}
								onClick={() => {
									discordSignOut();
								}}
							>
								Sign out
							</button>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
