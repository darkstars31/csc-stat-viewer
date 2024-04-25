import React from "react";
import { containerOptions } from "./containerOptions";

interface StandardContentThinBoxProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const StandardContentThinBoxBase: React.FC<StandardContentThinBoxProps> = ({ title, children, className }) => {
  return (
    <section className={`${className} bg-midnight1 rounded-lg shadow-md p-2 mb-3  shadow-black/20 dark:shadow-black/40`}>
      { title && <h1 className="font-bold text-md mb-3 px-2">{title}</h1> }
      <div className="place-content-center flex flex-row px-[1.5%]">
        {children}
      </div>
    </section>
  );
}

// Use containerOptions to create the new StandardContentThinBox with additional props
export const StandardContentThinBox = containerOptions(StandardContentThinBoxBase);
