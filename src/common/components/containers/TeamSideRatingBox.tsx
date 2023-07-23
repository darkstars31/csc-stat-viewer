import React from "react";

export function TeamSideRatingBox({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="place-items-center grid grid-cols-1 md:grid-cols-2 min-w-full min-h-[300px] bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
        {children}
      </section>
    );
  }