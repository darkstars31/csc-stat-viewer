import * as React from "react";
import { Table } from "../../common/components/table";
import * as Containers from "../../common/components/containers";
import { Player } from "../../models/player";
import { CscStats } from "../../models/csc-stats-types";
import { PlayerMappings } from "../../common/utils/player-utils";

type Props = {
  playerData?: Player[];
  limit?: number; // new prop for row limit
};

const excludedStatKeys: (keyof any)[] = ["name", "team", "__typename"]; 

function buildTableRow(player: Player, columnName: string, property: keyof CscStats) {
  return { player: player.name, tier: player.tier.name, [columnName]: player.stats[property] }; // Lowercase keys
}

export function AllStatsLeaderboards({ playerData = [], limit = 5 }: Props) {
  const playerStatsKeys = React.useMemo(() => {
    if (playerData.length > 0 && playerData[0].stats) {
      return Object.keys(playerData[0].stats) as (keyof CscStats)[];
    }
    return [];
  }, [playerData]);

  const filteredPlayerStatsKeys = React.useMemo(() => {
    // Filter out the excluded statKeys
    return playerStatsKeys.filter((key) => !excludedStatKeys.includes(key));
  }, [playerStatsKeys]);

  const leaderboards = React.useMemo(() => {
    const result: { [key: string]: { title: string; data: any[] } } = {};
    filteredPlayerStatsKeys.forEach((statKey) => {
      if (!playerData.every(player => player.stats && typeof player.stats[statKey] === 'number')) {
        return; // If the statKey is not present in every player data or is not a number, skip
      }

      const data = playerData
        .slice()
        .sort((a, b) => {
          const aValue = a.stats[statKey] as number;
          const bValue = b.stats[statKey] as number;
          return bValue - aValue;
        })
        .slice(0, limit)
        .map((p) => buildTableRow(p, statKey, statKey));

      result[statKey] = { title: PlayerMappings[statKey] || statKey, data };
    });
    return result;
  }, [playerData, filteredPlayerStatsKeys, limit]);

  // Now the condition
  if (!playerData || playerData.length === 0) {
    return null; // Or handle this error in another way
  }

  return (
    <>
      <Containers.StandardBoxRow>
        {Object.values(leaderboards).map(({ title, data }) => (
          <Containers.StandardContentBox key={`leaderboard.${title}`} title={title}>
            <Table rows={data} />
          </Containers.StandardContentBox>
        ))}
      </Containers.StandardBoxRow>
    </>
  );
}
