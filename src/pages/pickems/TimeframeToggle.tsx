import * as React from "react";

interface TimeframeToggleProps {
    selectedTimeframe: string[];
    setSelectedTimeframe: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TimeframeToggle: React.FC<TimeframeToggleProps> = ({ selectedTimeframe, setSelectedTimeframe }) => {
    const TimeToggles = [
        { label: "Past Matches", value: "past" },
        { label: "This Week", value: "current" },
        { label: "Future Matches", value: "future" },
    ];

    return (
        <div className="flex justify-center space-x-2 mb-6">
            {TimeToggles.map((timeframe) => (
                <button
                    key={timeframe.value}
                    onClick={() =>
                        setSelectedTimeframe((prev) =>
                            prev.includes(timeframe.value) ? prev.filter((p) => p !== timeframe.value) : [...prev, timeframe.value]
                        )
                    }
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedTimeframe.includes(timeframe.value)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {timeframe.label}
                </button>
            ))}
        </div>
    );
};
