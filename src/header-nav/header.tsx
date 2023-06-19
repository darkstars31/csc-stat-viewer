import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; //BellIcon,
import { Link, useLocation } from 'wouter';
import Select from "react-select";
import { useDataContext } from '../DataContext';
import { dataConfiguration } from "../dataConfig";
import { SiCounterstrike } from 'react-icons/si';
import { LuBarChart } from 'react-icons/lu';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const { setSelectedDataOption } = useDataContext();

  const selectClassNames = {
    placeholder: () => "text-gray-400 bg-inherit",
    container: () => "m-1 rounded bg-inherit",
    control: () => "p-2 rounded-l bg-slate-700",
    option: () => "p-2 hover:bg-slate-900",
    input: () => "text-slate-200",
    menu: () => "bg-slate-900",
    menuList: () => "bg-slate-700",
    multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
    multiValueLabel: () => "text-slate-200",
    multiValueRemove: () => "text-slate-800 pl-1",
    singleValue: () => "text-slate-200",
    
};

  const [ location ] = useLocation();

  const navigation = [
    { name: 'Home', href: '/', current: location.endsWith("/") },
    { name: 'Charts', href: '/charts', current: location.endsWith("/charts") },
    { name: 'Franchises', href: '/franchises', current: location.includes("franchises") },
    { name: 'Players', href: '/players', current: location.includes("players") },
    { name: 'Team Builder', href: '/team-builder', current: location.includes("team-builder") },
    { name: 'Leaderboards', href: '/leaderboards', current: location.includes("leaderboards") },
    // { name: 'About', href: '/about', current: false },
  ];

  const disableSeasonStatsSelector = location.includes("franchises");

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
                <div className="flex flex-shrink-0 -px-4 items-center">
                 <SiCounterstrike size="2em" />
                 <LuBarChart size="2em" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="inset-y-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0 basis-1/2 md:basis-1/4 w-full">
                {/* Profile dropdown */}
                <Menu as="div" className="grow">                  
                      { !disableSeasonStatsSelector ? <div className="text-xs grow">
                        <Select
                                isDisabled={disableSeasonStatsSelector}
                                className="grow"
                                unstyled
                                isSearchable={false}
                                defaultValue={{ label: dataConfiguration[0].name, value: dataConfiguration[0].name}}
                                classNames={selectClassNames}
                                options={dataConfiguration.map( item => ({ label: item.name, value: item.name}))}
                                onChange={setSelectedDataOption}
                            />
                      </div> : 
                       <Select
                        isDisabled={disableSeasonStatsSelector}
                        className="grow"
                        unstyled
                        isSearchable={false}
                        defaultValue={{ label: "Current Season", value: ""}}
                        classNames={selectClassNames}
                      />
                      }
                  
                    {/* <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button> */}              
                  <Transition
                    as={Fragment}
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
                          <Link to="#">
                            <button
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Your Profile
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="#">
                            <button
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Settings
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="#">
                            <button
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Sign out
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Link key={`header-${item.name}`} to={item.href} onClick={ () => close()}>
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    );
}