import * as React from "react";
import { Fieldset, Legend } from "@headlessui/react";


export function FieldSet ( { title, children }: { title: string, children: React.ReactNode | React.ReactNode[] }) {
    return (
        <Fieldset className="space-y-4 rounded-xl p-4 sm:p-6">
            <Legend className="font-semibold text-white uppercase">{title}</Legend>
            {children}
        </Fieldset>
    );
} 