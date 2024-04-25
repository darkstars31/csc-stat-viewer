import React from "react";
import { containerOptions } from "./containerOptions";

interface StandardContentBoxBaseProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

const StandardContentBoxBase: React.FC<StandardContentBoxBaseProps> = ({ children, className, title }) => {
  return (
    <section className={`${className} p-2 flex flex-col min-w-full min-h-[225px] h-fill bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40`}>
      { title && <div className="mb-1"><h1 className="align-top font-bold text-md px-2">{title}</h1></div> }
      <div className="place-content-center flex lg:flex-row flex-wrap p-1 min-w-full min-h-[225px]">
        {children}
      </div>
    </section>
  );
}

export const StandardContentBox = containerOptions(StandardContentBoxBase);