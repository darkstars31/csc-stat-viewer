import { Menu, Transition } from "@headlessui/react";
import * as React from "react";
import { IoNotifications } from "react-icons/io5";
import { useNotificationsContext } from "../NotificationsContext";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function HeaderNotifications() {

    const { notifications } = useNotificationsContext();
    console.info(notifications);

    return (
        <Menu as="div" className="relative inline-block">
            <Menu.Button className="flex text-sm focus:outline-none">
                {notifications.length > 0 &&
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                }
                <IoNotifications size={"1.5em"} className="mt-1" />
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
                <Menu.Items className="absolute -right-8 mt-2 w-80 sm:w-96 md:w-96 lg:w-96 z-20 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {notifications.length === 0 && 
                    <Menu.Item>
                        {({ active }) => (
                            <span className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                No notifications
                            </span>
                        )}
                    </Menu.Item>}
                    {
                        notifications.map( notification => (
                            <Menu.Item key={notification.id}>
                                {({ active }) => (
                                    <span className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-900')}>
                                        <a className='flex flex-row' href={`https://www.twitch.tv/${notification.href}`} target='_blank' rel="noreferrer">
                                            <div>
                                                <img src={notification.imageUrl} rel="noreferrer" alt="" />
                                            </div>
                                            <div className='basis-3/4 pl-2'>
                                                <div>{notification.title}</div>
                                                <div className='text-xs text-gray-500'>{notification.subText}</div>
                                            </div>
                                        </a>
                                    </span>
                                )}
                            </Menu.Item>
                        ))
                    }
                </Menu.Items>
            </Transition>
        </Menu>
    );
};