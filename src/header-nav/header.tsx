import React from 'react';
import { Disclosure} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; //BellIcon,
import { Link, useLocation } from 'wouter';
import { SiCounterstrike } from 'react-icons/si';
import { LuBarChart } from 'react-icons/lu';

import { HeaderNotifications } from './notifications';
import { HeaderProfile } from './profile';
import { NotificationsProvider } from '../NotificationsContext';
import { ToolsDropdown } from './tools-dropdown';


function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

const HeaderItem = ({ item, close }: { item :{ href: string, name: string, current: boolean }, close: () => void }) => {
	return (
		<Link
			key={item.name}
			to={item.href}
			onClick={() => close()}
			className={classNames(
				item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
				'block px-3 py-2 rounded-md text-sm font-medium'
			)}
			aria-current={item.current ? 'page' : undefined}
		>
			{item.name}
		</Link>
	);
}

export function Header() {

	const [location] = useLocation();

	const navigation = [
		//{ name: 'Home', href: '/', current: location.endsWith("/") },
		//{ name: 'Charts', href: '/charts', current: location.endsWith("/charts") || location.endsWith("/") },
		{ name: 'Franchises', href: '/franchises', current: location.includes("franchises") },
		{ name: 'Standings', href: '/Standings', current: location.endsWith("/Standings") },
		{ name: 'Players', href: '/players', current: location.includes("players") },
		{ name: 'Leaderboards', href: '/leaderboards', current: location.includes("leaderboards") },
		{ name: 'Tools', component: () => <ToolsDropdown />, current: location.includes("leaderboards") },
		{ name: 'About', href: '/about', current: location.includes("about") },
	];

	// const disableSeasonStatsSelector = location.includes("franchises");

	return (
		<Disclosure as="nav" className="bg-midnight2 w-full relative">
			{({ open, close }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<SiCounterstrike size="2em" />
									<LuBarChart size="2em" />
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<>
												{ item.href && <HeaderItem item={item} close={()=> {}} /> }
												{ item.component && item.component() }
											</>
										))}
									</div>
								</div>
							</div>
							<div className="inset-y-0 flex sm:static sm:inset-auto sm:ml-6 sm:pr-0 basis-1/2 md:basis-1/4 w-full justify-end gap-6">
								<NotificationsProvider>
									<HeaderNotifications />
								</NotificationsProvider>
								<HeaderProfile />
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3">
							{navigation.map((item) => (
								<>
								{ item.href && <HeaderItem item={item} close={close} /> }
								{ item.component && item.component() }
								</>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}