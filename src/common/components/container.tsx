import * as React from "react";

export function Container( { children }: { children: React.ReactNode | React.ReactNode[]} ) {
    return (
        <section className="overflow-auto min-h-screen">
            <div className="max-w-7xl mx-auto px-4 mb-8 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}