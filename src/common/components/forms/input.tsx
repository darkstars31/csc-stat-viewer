import * as React from "react";
import { Input as HeadlessInput, InputProps } from "@headlessui/react";

export const Input = ( { ...args}: InputProps ) => <HeadlessInput {...args} />