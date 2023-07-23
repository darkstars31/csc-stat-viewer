import React from "react";

export function StandardContentBox({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="place-content-center flex flex-col p-2 my-3 min-h-[225px] bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
        {children}
      </section>
    );
  }
  