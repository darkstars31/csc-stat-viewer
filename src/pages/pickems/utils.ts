import React from 'react';
import dayjs from "dayjs";
import { Match } from '../../models/matches-types';

const currentDate = dayjs();

export const hasMatchStarted = (matchDate: Date) => {
        return dayjs(matchDate).isBefore(currentDate);
    };

export const matchesByMatchDay = (matches: Match[], userTier?: string) => matches?.filter( m => m.matchDay.number.includes("M") && !m.home.franchise.name.includes("To Be Determined"))
    .filter( m => m.home.tier.name === userTier)
        .reduce((acc: any, match: any) => {
            const matchday = dayjs(match.scheduledDate).format("YYYY-MM-DD");
            if (!acc[matchday]) {
                acc[matchday] = [];
            }
            acc[matchday].push(match);
            return acc;
        }, {}) ?? [];