// src/common/components/containers/containerOptions.tsx
import React, { ReactNode } from "react";

interface ContainerOptionsProps {
  title?: ReactNode;
  isFlexRow?: boolean;
  className?: string;
}

export function containerOptions<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & ContainerOptionsProps> {
  return ({
    title,
    isFlexRow = false,
    className = '',
    children,
    ...props
  }: ContainerOptionsProps & { children?: ReactNode }) => {
    const flexRowClass = isFlexRow ? 'sm:flex-row' : '';
    const fullClassName = `${className} ${flexRowClass}`;

    return (
      <Component {...(props as P)} className={fullClassName} title={title}>
        {children}
      </Component>
    );
  };
}
