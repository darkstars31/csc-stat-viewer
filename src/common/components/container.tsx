import * as React from "react";

export function Container( { children }: { children: React.ReactNode | React.ReactNode[]} ) {
    return (
        <section className="bg-gray-700 text-white h-screen">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}