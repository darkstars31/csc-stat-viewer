import { Menu, Transition } from "@headlessui/react";
import * as React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Link } from "wouter";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export const ToolsDropdown = () => {
	const [open, setOpen] = React.useState(false);
	return (
		<Menu as="div" className="relative inline-block">
			<Menu.Button
				className="flex text-sm focus:outline-none px-3 py-2 rounded-md font-medium text-gray-300 hover:bg-gray-700"
				onClick={() => setOpen(value => !value)}
			>
				Tools{" "}
				{open ?
					<MdKeyboardArrowUp size="1.5em" className="leading-8 pl-1" />
				:	<MdKeyboardArrowDown size="1.5em" className="leading-8 pl-1" />}
			</Menu.Button>
			<Transition
				as={React.Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute mt-2 w-96 sm:w-48 z-20 origin-top-right rounded-md bg-midnight2 py-1 shadow-lg focus:outline-none hover:cursor-pointer">
					<Menu.Item>
						{({ active }) => (
							<Link to="/charts">
								<span
									className={classNames(
										active ? "bg-gray-100" : "",
										"block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700",
									)}
								>
									Charts
								</span>
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link to="/player-compare">
								<span
									className={classNames(
										active ? "bg-gray-100" : "",
										"block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700",
									)}
								>
									Player Comparison
								</span>
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link to="/export">
								<span
									className={classNames(
										active ? "bg-gray-100" : "",
										"block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700",
									)}
								>
									Stats Exporter
								</span>
							</Link>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
