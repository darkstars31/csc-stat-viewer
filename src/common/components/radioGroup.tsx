import * as React from "react";
import { useState } from 'react'
import { RadioGroup as RadioGroupHeadless } from '@headlessui/react'

type Props = {
    title?: string,
    options: string[],
    onChange: ( value: string ) => void
}

export function RadioGroup( { title, options, onChange }: Props ) {
  let [value, setValue] = useState('startup')

  function update(){
    onChange( value );
    return setValue;
  }

  return (
    <RadioGroupHeadless value={value} onChange={update}>
      { title && <RadioGroupHeadless.Label>{title}</RadioGroupHeadless.Label> }
      { options.map( option =>
         <RadioGroupHeadless.Option value={option}>
         {({ checked }) => (
           <span className={checked ? 'bg-blue-200' : ''}>{option}</span>
         )}
       </RadioGroupHeadless.Option>
      ) }
    </RadioGroupHeadless>
  )
}