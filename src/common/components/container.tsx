import * as React from "react";

export function Container( { children }: { children: React.ReactNode | React.ReactNode[]} ) {
    return (
        <section className="container h-screen py-16">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}