import React from "react";

export function StandardBackgroundPage({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-4 dark:border-gray-800">
        {children}
      </section>
    );
  }