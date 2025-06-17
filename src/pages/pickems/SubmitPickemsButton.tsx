import * as React from "react";

interface SubmitPickemsButtonProps {
    submitWasSuccessful: boolean;
    handleSubmit: () => Promise<void>;
    submitError?: boolean;
    isSubmitting: boolean;
}

export const SubmitPickemsButton: React.FC<SubmitPickemsButtonProps> = ({ submitWasSuccessful, handleSubmit, isSubmitting, submitError }) => {
    return (
        <div className="mt-8 flex justify-center">
            {submitWasSuccessful && 
                <div className="flex items-center justify-center">
                    <div className="text-green-500 text-6xl animate-bounce">✔️</div>
                </div>
            }
            { submitError && 
                <div className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 animate-wiggle hover:animate-none active:translate-y-1 active:shadow-inner active:scale-95 active:bg-gradient-to-r active:from-blue-600 active:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}>
                    <div className="text-red-500 text-6xl">❌</div>
                </div>
            }
            {!submitWasSuccessful && 
                <button
                    onClick={handleSubmit}
                    className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none active:translate-y-1 active:shadow-inner active:scale-95 active:bg-gradient-to-r active:from-blue-600 active:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isSubmitting}
                >
                    {!isSubmitting ? "SUBMIT YOUR PICKS! ✨" : "Submitting"}
                </button>
            }
        </div>
    );
};
