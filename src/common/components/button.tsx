import * as React from "react";
import { FaCheck } from "react-icons/fa";

type Props = {
    onClick: () => void,
    children: string | React.ReactNode,
    className?: string,
}

export function Button ({ onClick, children, className }: Props) {
    const [wasSuccessful, setWasSuccessful] = React.useState<boolean>(false);

    const handleClick = () => {
        onClick();
        setWasSuccessful(true);
    }

    React.useEffect(() => {
		if (wasSuccessful) {
			setTimeout(() => {
				setWasSuccessful(!wasSuccessful);
			}, 2250);
		}
	}, [wasSuccessful]);

    return (
        <button className={`${className} text-center`} onClick={handleClick}>
            { wasSuccessful ? <FaCheck className="text-green-500 mt-1 inlinecursor-pointer animate-bounce" /> : children}
        </button>
    )
}
