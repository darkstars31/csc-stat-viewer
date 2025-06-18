import * as React from 'react';
import { TeamHistory } from '../../models/profile-types';

type Props = {
    playerProfile: {
        teamHistory: TeamHistory[]
    }
}

export const PlayerHistory = ( { playerProfile }: Props ) => {
    console.info(playerProfile.teamHistory)

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto">
                <ul className="flex flex-col gap-3">
                    {playerProfile.teamHistory.map((history, index) => {
                        let bubbleColor = "";
                        let icon = null;

                        switch (history?.changeType?.toUpperCase() ?? "") {
                            case "CUT":
                                bubbleColor = "bg-red-100 border-red-400 text-red-800";
                                icon = (
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                );
                                break;
                            case "SIGN":
                                bubbleColor = "bg-blue-100 border-blue-400 text-blue-800";
                                icon = (
                                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                );
                                break;
                            case "SUB":
                                bubbleColor = "bg-green-100 border-green-400 text-green-800";
                                icon = (
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
                                    </svg>
                                );
                                break;
                            case "DRAFT":
                                bubbleColor = "bg-purple-100 border-purple-400 text-purple-800";
                                icon = (
                                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="4" y="4" width="16" height="16" rx="4" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                                    </svg>
                                );
                                break;
                            default:
                                bubbleColor = "bg-gray-100 border-gray-400 text-gray-800";
                                icon = (
                                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                );
                        }

                        return (
                            <li
                                key={index}
                                className={`flex items-center border rounded-xl px-2 py-1 shadow-sm ${bubbleColor}`}
                            >
                                {icon}
                                <div className="flex flex-row flex-1 gap-4">
                                    <div className="font-semibold uppercase">{history.changeType}</div>
                                    <div className="text-xs">{history.value}</div>
                                    <div className="text-xs">{new Date(history.dateCreated).toLocaleDateString()}</div>
                                    {
                                        history.metadata?.teamId &&
                                        <div>({history.metadata.franchisePrefix})</div>
                                    }                            
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}