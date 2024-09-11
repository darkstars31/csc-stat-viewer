import * as React from "react";
import { Input as HeadlessInput, InputProps } from "@headlessui/react";


export function Input( { ...args}: InputProps ) {

    return (
        <div>
            <HeadlessInput {...args} />
        </div>
    )

}