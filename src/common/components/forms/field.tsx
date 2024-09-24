import { Field as FieldHeadless, Label } from "@headlessui/react";
import * as React from "react";

type Props = {
    title: string, 
    children: React.ReactNode | React.ReactNode[], 
    className?: string, 
    isValid?: boolean,
    errorMessage?: string
}

export function Field( { title, children, className, isValid = true, errorMessage }: Props ) {

    return (
        <>
            <FieldHeadless className={`${className} ${isValid ? "" : "border-b border-red-500"}`}>
                <Label className="text-sm/6 font-medium text-white p-2">{title}</Label>
                {children}
            </FieldHeadless>
            { !isValid && <div className="pl-2 h-4 text-xs text-red-500">{errorMessage}</div> }
        </>
    );
}