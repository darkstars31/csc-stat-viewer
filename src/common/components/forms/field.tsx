import { Field as FieldHeadless, Label } from "@headlessui/react";
import * as React from "react";

export function Field( { title, children }: { title: string, children: React.ReactNode | React.ReactNode[] } ) {
    
    return (    
        <FieldHeadless>
            <Label className="text-sm/6 font-medium text-white p-2">{title}</Label>
            {children}
        </FieldHeadless>
    );
}