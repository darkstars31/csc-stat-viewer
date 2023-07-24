import React from "react";

export function StandardContentThinBox({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="place-content-center mb-3 flex flex-col sm:flex-row bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
        {children}
      </section>
    );
  }