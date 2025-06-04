import * as React from "react";

interface ErrorMessageProps {
    error: unknown;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;

    // Extract a meaningful error message
    let errorMessage = "An unexpected error occurred";
    if (typeof error === "string") {
        errorMessage = error;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String((error as any).message);
    }

    return (
        <div className="text-center mx-auto w-full max-w-md text-sm bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow-md">
            <p className="font-semibold mb-1">Error submitting pickems, please try again</p>
            <p className="italic">{errorMessage}</p>
        </div>
    );
};
