import * as React from 'react';
import { Container } from '../common/components/container';
import DataTable, { Alignment, Direction, TableColumn } from 'react-data-table-component';
import { useDataContext } from '../DataContext';
import { MultiValue } from 'react-select';
import { PlayerTypes } from '../common/utils/player-utils';
import { PlayerTypeFilter } from '../common/components/filters/playerTypeFilter';
import { PlayerTiersFilter } from '../common/components/filters/playerTiersFilter';
import { PlayerRolesFilter } from '../common/components/filters/playerRoleFilter';
import { Pill } from '../common/components/pill';
import { Input } from '../common/components/input';
import { Player } from '../models';
import Papa from 'papaparse';
import { TbDatabaseExport } from 'react-icons/tb';

const exportAsCsv = ( players: Player[]) => {
    const playerData = players.filter( p => Boolean(p.stats))
        .map( p => {
            // Hack to remove properties from stats and include player first class properties
            const { name, team, __typename, rating, ...rest } = p.stats; 
            const stats = Object.keys(rest)
                .reduce( (acc, k) => {
                    const value = rest[k as keyof typeof rest];
                    acc[k] = typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value;
                    return acc
                }, {} as any);
            return ({ name: p.name, tier: p.tier.name, role: p.role, mmr: p.mmr, rating: p.stats.rating, ...stats });
            }
        );
    var csv = Papa.unparse(  playerData );
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'PlayersWithStats.csv');
    a.click()
};

export function ExportData() {
    const { players } = useDataContext();
    const [ searchValue, setSearchValue ] = React.useState("");
    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ viewTierOptions, setViewTierOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();
    const [ viewPlayerTypeOptions, setViewPlayerTypeOptions ] = React.useState<MultiValue<{label: string;value: PlayerTypes[];}>>();
    const [ viewPlayerRoleOptions, setViewPlayerRoleOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();

    const viewPlayerTypeOptionsCumulative = viewPlayerTypeOptions?.flatMap( option => option.value);
    const filteredByPlayerType = viewPlayerTypeOptions?.length ? players.filter( player => viewPlayerTypeOptionsCumulative?.some( type => type === player.type )) : players;
    const filteredByTier = viewTierOptions?.length ? filteredByPlayerType.filter( player => viewTierOptions?.some( tier => tier.value === player.tier.name)) : filteredByPlayerType;
    const filteredByRole = viewPlayerRoleOptions?.length ? filteredByTier.filter( player => viewPlayerRoleOptions?.some( role => role.value === player.role)) : filteredByTier;
    const filteredBySearchPlayers = filters.length > 0 ? filteredByRole.filter( player => filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ))) : filteredByRole;

    const addFilter = () => {
        setSearchValue(""); 
        const newFilters = [ ...filters, searchValue ].filter(Boolean);
        setFilters( newFilters );
    }

    const removeFilter = ( label: string ) => {
        const newFilters = filters;
        delete newFilters[filters.indexOf(label)];
        setFilters( newFilters.filter(Boolean) );
    }

    const playerData = filteredBySearchPlayers.filter( p => Boolean(p.stats))
        .map( ( p ) => {
            // Hack to remove properties from stats and include player first class properties
            const { name, team, __typename, rating, ...rest } = p.stats; 
            const stats = Object.keys(rest)
                .reduce( (acc, k ) => {
                    const value = rest[k as keyof typeof rest];
                    acc[k] = typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value;
                    return acc
                }, {} as any);
            const playerType = p.type?.includes("PERM") ? "PFA" : "FA"
            return ({ name: p.name, tier: p.tier.name, team: p.team?.name ?? playerType, role: p.role, mmr: p.mmr, rating: p.stats.rating.toFixed(2), ...stats });
            }
        );

    const columns: TableColumn<any>[] = Object.keys(playerData[0] ?? {}).map( k => ({ name: k, selector: row => row[k], sortable: true, reorder: true, grow: 3}));

    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Export Players</h2>
            <p className="mt-4 text-gray-300">
                Export a list of players based on filters below as a CSV
            </p>
            <p className="mt-4 text-gray-300">
                Showing {filteredBySearchPlayers.length} of {players.length} Players
            </p>
            <form className="flex flex-box h-12 mx-auto" onSubmit={(e)=>{e.preventDefault()}}>
                <Input
                    className="basis-1/2 grow"
                    label="Filter"
                    placeHolder="Player Name"
                    type="text"
                    onChange={ ( e ) => setSearchValue(e.currentTarget.value)}
                    value={searchValue}
                />
                <button
                    type="submit"
                    className="basis-1/6 ml-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                    onClick={addFilter}
                    >
                    +Filter
                </button>
            </form>
            <div className="pt-4">
                {filters.map( filter => 
                    <Pill key={filter} label={filter} onClick={() => removeFilter(filter)}/>
                    )
                }
            </div>
        </div>
        <div className={`flex flex-col mt-48 md:flex-row md:mt-0 h-12 justify-end`}>
            <div className="basis-1/3">
                <PlayerTypeFilter onChange={setViewPlayerTypeOptions as typeof React.useState<MultiValue<{label: string;value: PlayerTypes[];}>>} />
            </div>
            <div className="basis-1/3">
                <PlayerTiersFilter onChange={setViewTierOptions as typeof React.useState<MultiValue<{label: string;value: string;}>>} />
            </div>
            <div className="basis-1/5">
                <PlayerRolesFilter onChange={setViewPlayerRoleOptions as typeof React.useState<MultiValue<{label: string;value: string;}>>} />
            </div>
            <div className="basis-1/5">
                <div className="flex flex-row text-xs my-2 mx-1">
                    <button title="Export Stats as CSV" className={`p-2 m-1 rounded border bg-indigo-600 border-indigo-600`} onClick={ () => exportAsCsv(filteredBySearchPlayers) }><span className='flex flex-row'><TbDatabaseExport className='mr-2' />Export</span></button>
                </div>
            </div>
        </div>
        <div className='my-8' />
        <DataTable
            dense
            columns={columns}
            data={playerData}
            direction={Direction.LTR}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            noHeader
            responsive
            striped
            subHeaderAlign={Alignment.RIGHT}
            subHeaderWrap
        />
        </Container>
    );
}