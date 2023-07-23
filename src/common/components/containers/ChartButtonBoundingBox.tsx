import React from "react";

export function ChartButtonBoundingBox({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div className="flex space-x-4 mb-3 max-w-[450px]">{children}</div>;
  }