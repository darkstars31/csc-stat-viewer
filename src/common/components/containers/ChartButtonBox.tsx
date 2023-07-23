import React from "react";
import { SelectedChartButton } from "./SelectedChartButton";
import { UnselectedChartButton } from "./UnselectedChartButton";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isSelected?: boolean;
  onClick?: () => void; // Make onClick prop optional by adding ?
};

export function ChartButtonBox({ children, isSelected, onClick }: Props) {
  // Provide a default function for onClick when it's not provided
  const handleClick = onClick || (() => {});

  return (
    <>
      {isSelected ? (
        <SelectedChartButton onClick={handleClick}>{children}</SelectedChartButton>
      ) : (
        <UnselectedChartButton onClick={handleClick}>{children}</UnselectedChartButton>
      )}
    </>
  );
}
