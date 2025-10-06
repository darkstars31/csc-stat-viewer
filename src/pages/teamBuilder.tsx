import * as React from "react";
import { useMemo, useState } from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { PlayerMappings, statDescriptionsShort } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { Player } from "../models/player";

const ComparisonTable = React.lazy(() =>
  import("./playerComparison/comparisonTable").then((module) => ({ default: module.ComparisonTable }))
);

export function TeamBuilder() {
  const { players = [], isLoading, extendedPlayerStats, tiers } = useDataContext();

  // Selected players for the bottom table
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // Filter builder state
  type NumericOp = ">" | ">=" | "<" | "<=" | "=";
  type StringOp = "contains" | "startsWith" | "endsWith" | "=" | "!=";
  type FilterRow = { field?: string; op: NumericOp | StringOp; value?: string | number };
  const [filters, setFilters] = useState<FilterRow[]>([{ op: ">=", value: undefined, field: undefined }]);
  const [searchName, setSearchName] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  // Build list of stat keys from PlayerMappings (core stats) and extended stats
  const extendedStatsArray = useMemo(() => {
    const apiPayload = (extendedPlayerStats as any);
    const data = apiPayload && typeof apiPayload === "object" && "data" in apiPayload ? apiPayload.data : apiPayload;
    return Array.isArray(data) ? (data as any[]) : [];
  }, [extendedPlayerStats]);

  const extendedKeys = useMemo(() => {
    const first = extendedStatsArray?.[0] ?? {};
    return Object.keys(first || {})
      .filter((k) => k !== "name")
      .filter((k) => typeof first[k] === "number");
  }, [extendedStatsArray]);

  const allStatOptions = useMemo(() => {
    const coreOptions = Object.entries(PlayerMappings).map(([key, label]) => ({
      value: key,
      label: `${label} (${key})`,
      group: "Core",
    }));
    const extOptions = extendedKeys
      .filter((k) => !(k in PlayerMappings))
      .map((key) => ({
        value: key,
        label: `${statDescriptionsShort[key as keyof typeof statDescriptionsShort] ?? key} (${key})`,
        group: "Extended",
      }));
    const mmrOption = { value: "mmr", label: "MMR (mmr)", group: "Core" };
    return [mmrOption, ...coreOptions, ...extOptions].sort((a, b) => a.label.localeCompare(b.label));
  }, [extendedKeys]);

  // Helper to read stat value from player
  const getStatValue = (player: Player, key?: string): any => {
    if (!key) return undefined;
    if (key === "mmr") return player.mmr;
    // core stat
    if (key in PlayerMappings) {
      return (player.stats as any)?.[key];
    }
    // extended stat
    return (player.extendedStats as any)?.[key];
  };

  // Determine if a field is string-like based on sample data
  const isStringField = (field?: string): boolean => {
    if (!field) return false;
    // Check in players first
    for (const p of players) {
      const v = getStatValue(p, field);
      if (v !== undefined && v !== null) {
        return typeof v === "string";
      }
    }
    // Check extended stats array sample
    const sample = extendedStatsArray?.[0];
    if (sample && Object.prototype.hasOwnProperty.call(sample, field)) {
      return typeof (sample as any)[field] === "string";
    }
    return false;
  };

  // Apply all filters (AND) and sort results
  const matchingPlayers = useMemo(() => {
    const normalized = players
      .filter((p) => !p.tier?.name?.includes("Unrated"))
      .filter((p) => (tierFilter.length > 0 ? tierFilter.includes(p.tier?.name ?? "") : true))
      .filter((p) => (typeFilter.length > 0 ? typeFilter.includes((p as any)?.type ?? "") : true));
    const filtered = normalized.filter((p) => {
      // name search first
      if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;

      // all filters must pass
      return filters.every((f) => {
        if (!f.field || f.value === undefined || f.value === null) return true;
        const v = getStatValue(p, f.field);
        if (v === undefined || v === null) return false;
        const fieldIsString = isStringField(f.field);
        if (fieldIsString) {
          const left = String(v).toLowerCase();
          const right = String(f.value).toLowerCase();
          switch (f.op as StringOp) {
            case "contains":
              return left.includes(right);
            case "startsWith":
              return left.startsWith(right);
            case "endsWith":
              return left.endsWith(right);
            case "=":
              return left === right;
            case "!=":
              return left !== right;
            default:
              return true;
          }
        } else {
          if (Number.isNaN(Number(v)) || Number.isNaN(Number(f.value))) return false;
          switch (f.op as NumericOp) {
            case ">":
              return Number(v) > Number(f.value);
            case ">=":
              return Number(v) >= Number(f.value);
            case "<":
              return Number(v) < Number(f.value);
            case "<=":
              return Number(v) <= Number(f.value);
            case "=":
              return Number(v) === Number(f.value);
            default:
              return true;
          }
        }
      });
    });

    // sort by filtered stat keys in order (desc). If none, by rating desc then mmr desc
    const sortKeys = filters.map((f) => f.field).filter(Boolean) as string[];
    const toNumber = (val: any) => (val === undefined || val === null || Number.isNaN(Number(val)) ? -Infinity : Number(val));

    const sorted = [...filtered].sort((a, b) => {
      if (sortKeys.length > 0) {
        for (const key of sortKeys) {
          const aval: any = getStatValue(a, key);
          const bval: any = getStatValue(b, key);
          const aIsNum = typeof aval === 'number' || (!isNaN(Number(aval)) && aval !== null && aval !== undefined && aval !== '');
          const bIsNum = typeof bval === 'number' || (!isNaN(Number(bval)) && bval !== null && bval !== undefined && bval !== '');
          if (aIsNum && bIsNum) {
            const av = toNumber(aval);
            const bv = toNumber(bval);
            if (av !== bv) return bv - av; // desc
          } else {
            const as = String(aval ?? "").toLowerCase();
            const bs = String(bval ?? "").toLowerCase();
            if (as !== bs) return bs.localeCompare(as); // desc lexicographic
          }
        }
      } else {
        const ar = toNumber(a.stats?.rating);
        const br = toNumber(b.stats?.rating);
        if (ar !== br) return br - ar;
        const am = toNumber(a.mmr);
        const bm = toNumber(b.mmr);
        if (am !== bm) return bm - am;
      }
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [players, filters, searchName, tierFilter, typeFilter]);

  const addFilterRow = () => setFilters((rows) => [...rows, { op: ">=", value: undefined, field: undefined }]);
  const removeFilterRow = (idx: number) => setFilters((rows) => rows.filter((_, i) => i !== idx));

  const setFilterField = (idx: number, field?: string) =>
    setFilters((rows) => rows.map((r, i) => {
      if (i !== idx) return r;
      const stringField = isStringField(field);
      const defaultOp: NumericOp | StringOp = stringField ? "contains" : ">=";
      return { ...r, field, op: defaultOp, value: undefined };
    }));
  const setFilterOp = (idx: number, op: FilterRow["op"]) =>
    setFilters((rows) => rows.map((r, i) => (i === idx ? { ...r, op } : r)));
  const setFilterValue = (idx: number, value?: string | number) =>
    setFilters((rows) => rows.map((r, i) => (i === idx ? { ...r, value } : r)));

  const onAddPlayer = (player: Player) => {
    setSelectedPlayers((prev) => (prev.find((p) => p.name === player.name) ? prev : [...prev, player]));
  };
  const onRemoveSelected = (player: Player) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.name !== player.name));
  };

  // Keys of stats currently used in filters (unique)
  const filteredStatKeys = useMemo(
    () => Array.from(new Set(filters.map((f) => f.field).filter(Boolean))) as string[],
    [filters]
  );

  const getLabelForKey = (key: string) =>
    PlayerMappings[key as keyof typeof PlayerMappings] ??
    statDescriptionsShort[key as keyof typeof statDescriptionsShort] ??
    key;

  const formatVal = (val: any) =>
    typeof val === "number" ? Number(val).toFixed(2) : val ?? "-";

  const formatPlayerType = (t?: string) => {
    if (!t) return "-";
    return String(t)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-bold sm:text-4xl">Team Builder</h2>
      <p>Build filters on stat fields to find players. Select any stat (core or extended), choose an operator and a value. Click a player to add to the comparison table below.</p>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Filter Builder */}
        <div className="space-y-3">
          {/* Tier filter */}
          <div className="flex items-center gap-2">
            <div className="grow">
              <Select
                placeholder="Filter by tier..."
                unstyled
                isMulti
                classNames={selectClassNames}
                options={(tiers ?? []).map((t: any) => ({ label: t.tier.name, value: t.tier.name }))}
                value={tierFilter.map((t) => ({ label: t, value: t }))}
                onChange={(opts) => setTierFilter((opts as any[] | null)?.map((o) => o.value) ?? [])}
                isClearable
                isSearchable
              />
            </div>
          </div>
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <div className="grow">
              <Select
                placeholder="Filter by type..."
                unstyled
                isMulti
                classNames={selectClassNames}
                options={Array.from(new Set(players.map((p: any) => p?.type).filter(Boolean)))
                  .sort()
                  .map((t: any) => ({ label: formatPlayerType(String(t)), value: String(t) }))}
                value={typeFilter.map((t) => ({ label: formatPlayerType(t), value: t }))}
                onChange={(opts) => setTypeFilter((opts as any[] | null)?.map((o) => o.value) ?? [])}
                isClearable
                isSearchable
              />
            </div>
          </div>
          {filters.map((f, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="grow">
                <Select
                  placeholder="Select stat..."
                  unstyled
                  classNames={selectClassNames}
                  options={allStatOptions}
                  value={
                    f.field
                      ? allStatOptions.find((o) => o.value === f.field) ?? null
                      : null
                  }
                  onChange={(opt) => setFilterField(idx, (opt as any)?.value)}
                  isClearable
                  isSearchable
                />
              </div>
              <select
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
                value={f.op}
                onChange={(e) => setFilterOp(idx, e.target.value as FilterRow["op"])}
              >
                {isStringField(f.field) ? (
                  <>
                    <option value="contains">contains</option>
                    <option value="startsWith">starts with</option>
                    <option value="endsWith">ends with</option>
                    <option value="=">equals</option>
                    <option value="!=">not equal</option>
                  </>
                ) : (
                  <>
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value="=">=</option>
                  </>
                )}
              </select>
              {isStringField(f.field) ? (
                <input
                  type="text"
                  className="w-40 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
                  placeholder="Value"
                  value={(typeof f.value === 'string' ? f.value : '') as string}
                  onChange={(e) => setFilterValue(idx, e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  step="any"
                  className="w-28 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
                  placeholder="Value"
                  value={(typeof f.value === 'number' ? f.value : '') as number | string}
                  onChange={(e) => setFilterValue(idx, e.target.value === "" ? undefined : Number(e.target.value))}
                />
              )}
              <button
                className="rounded bg-red-600 px-2 py-1 text-white text-xs disabled:opacity-50"
                onClick={() => removeFilterRow(idx)}
                disabled={filters.length === 1}
                title="Remove filter"
              >
                Remove
              </button>
            </div>
          ))}
          <div>
            <button className="rounded bg-blue-600 px-3 py-1 text-white text-sm" onClick={addFilterRow}>
              Add Filter
            </button>
          </div>
        </div>

        {/* Right: Matching Players */}
        <div className="border border-gray-200 dark:border-gray-800 rounded">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <div className="font-semibold">Matching Players ({matchingPlayers.length})</div>
            <div className="ml-auto w-64">
              <input
                type="text"
                placeholder="Search players..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="max-h-[60vh] overflow-auto divide-y divide-gray-200 dark:divide-gray-800">
            {matchingPlayers.map((p) => (
              <div key={p.name} className="px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-gray-500">{p.tier?.name} → {formatPlayerType((p as any)?.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-x-3">
                      <span><strong>MMR:</strong> {p.mmr ?? "-"}</span>
                      <span>
                        <strong>Rating:</strong> {p.stats?.rating?.toFixed ? p.stats.rating.toFixed(2) : (p.stats?.rating ?? "-")}
                        {typeof p.stats?.gameCount === 'number' && (
                          <> (<span title="Games Played">{p.stats.gameCount}</span>)</>
                        )}
                      </span>
                    </div>
                    <button
                      className="rounded bg-green-600 px-3 py-1 text-white text-xs disabled:opacity-50"
                      onClick={() => onAddPlayer(p)}
                      disabled={!!selectedPlayers.find((sp) => sp.name === p.name)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {filteredStatKeys.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                    {filteredStatKeys.map((k) => (
                      <div key={`${p.name}-${k}`} className="break-words whitespace-normal overflow-visible">
                        <span className="text-gray-500">{getLabelForKey(k)}:</span>{" "}
                        <span className="font-medium">{formatVal(getStatValue(p, k))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected players chips */}
      {selectedPlayers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedPlayers.map((p) => (
            <span key={p.name} className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs">
              {p.name}
              <button className="text-red-600" onClick={() => onRemoveSelected(p)} title="Remove">
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <React.Suspense fallback={<Loading />}>
        <div className="mt-4">
          <ComparisonTable selectedPlayers={selectedPlayers} />
        </div>
      </React.Suspense>
    </Container>
  );
}
