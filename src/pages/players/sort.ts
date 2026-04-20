import _get from "lodash/get";

import { Player } from "../../models";

export type SortOption = {
	label: string;
	value: string;
};

export type SortDirection = "asc" | "desc";

export const sortOptionsList: SortOption[] = [
	{ label: "Name", value: "name" },
	{ label: "Rating", value: "stats.rating" },
	{ label: "MMR", value: "mmr" },
	{ label: "CSC ID", value: "id" },
	{ label: "Tier", value: "tier.name" },
	{ label: "Role", value: "role" },
	{ label: "Team", value: "team.franchise.name" },
];

export const defaultSortOption = sortOptionsList[0];

export function sortPlayers(players: Player[], sortBy: SortOption, sortDirection: SortDirection) {
	return [...players].sort((leftPlayer, rightPlayer) => {
		const leftValue = normalizeSortValue(_get(leftPlayer, sortBy.value));
		const rightValue = normalizeSortValue(_get(rightPlayer, sortBy.value));

		if (leftValue === rightValue) {
			return 0;
		}

		if (leftValue == null) {
			return sortDirection === "asc" ? 1 : -1;
		}

		if (rightValue == null) {
			return sortDirection === "asc" ? -1 : 1;
		}

		if (typeof leftValue === "number" && typeof rightValue === "number") {
			return sortDirection === "asc" ? leftValue - rightValue : rightValue - leftValue;
		}

		const comparison = String(leftValue).localeCompare(String(rightValue), undefined, {
			numeric: true,
			sensitivity: "base",
		});

		return sortDirection === "asc" ? comparison : comparison * -1;
	});
}

function normalizeSortValue(value: unknown) {
	if (typeof value === "string") {
		return value.trim().toLowerCase();
	}

	return value ?? null;
}