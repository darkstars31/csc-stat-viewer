import * as React from 'react';
import { DialogPanel, DialogTitle } from '@headlessui/react';

export const PickemsRules = ( {setIsShowRules}: { setIsShowRules: ( value: boolean) => void} ) => {

    return ( 
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                            <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
                                <div className="bg-blue-600 p-4">
                                    <DialogTitle className="text-xl font-bold text-white flex justify-between items-center">
                                        Pickems Rules
                                        <button 
                                            onClick={() => setIsShowRules(false)}
                                            className="text-white hover:text-gray-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </DialogTitle>
                                </div>
                                <div className="p-6">
                                    <p className="mb-4">Pick the winner for each match-up. Predictions must be submitted before matches begins.</p>
                                    <ul className="list-disc pl-5 mb-4">
                                        <li>You can update your picks at any time up to 5 minutes before the scheduled match start time.</li>
                                        <li>Feel free to set your pickems for this week and any future match days.</li>
                                    </ul>
                                    <p className="font-semibold mb-2">Points are awarded as follows:</p>
                                    <ul className="list-disc pl-5 mb-4">
                                        <li>1 point for each correct prediction</li>
                                    </ul>
                                    <p className="mt-4 font-semibold">May your picks be ever in your favor!</p>
                                </div>
                            </DialogPanel>
                        </div>
    )
}
