import { Transition } from "@headlessui/react";
import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Card } from "../card";

export const Exandable = ({ title, children }: { title: string | React.ReactNode, children: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if( isExpanded ){
            setTimeout(() => divRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    }, [ isExpanded ]);

    return (
        <div className="flex flex-col gap-4">
            <Card>
            <div ref={divRef} />
             <div className="flex m-1" onClick={() => setIsExpanded(!isExpanded)}>
                <h1 className={`text-lg`}>{title}</h1>
                <div className="pt-1">{ isExpanded ? <MdKeyboardArrowUp size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> }</div>
            </div>
            <Transition
                as={"div"}
                show={isExpanded}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >      
                {children}
            </Transition>
            </Card>
        </div>
    )
}