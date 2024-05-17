import React from "react";

export function ThreeColumnBoxRow({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</section>
  );
}