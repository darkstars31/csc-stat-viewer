import * as React from "react";

interface TimeframeToggleProps {
    selectedTimeframe: string[];
    setSelectedTimeframe: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TimeframeToggle: React.FC<TimeframeToggleProps> = ({ selectedTimeframe, setSelectedTimeframe }) => {
    return (
        <div className="flex justify-center space-x-2 mb-6">
            <button
                onClick={() =>
                    setSelectedTimeframe((prev) =>
                        prev.includes("future") ? prev.filter((p) => p !== "future") : [...prev, "future"]
                    )
                }
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedTimeframe.includes("future")
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
                Future Matches
            </button>
        </div>
    );
};
