import * as React from "react";

export function Container( { children }: { children: React.ReactNode | React.ReactNode[]} ) {
    return (
        <section className="h-screen my-4 py-4 mx-auto">
            <div className="overflow-x-hidden max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}