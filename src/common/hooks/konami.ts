import { useEffect, useState } from "react";
import { useInputEvent } from "./inputEvent";

const konamiCode = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"KeyB",
	"KeyA",
];

export const useKonamiCode = () => {
	const [count, setCount] = useState(0);
	const [success, setSuccess] = useState(false);
	const key = useInputEvent();

	useEffect(() => {
		if (key == null) return;
		console.info(key);
		if (key !== konamiCode[count]) {
			setCount(0);
			return;
		}

		setCount(state => state + 1);
		if (count + 1 === konamiCode.length) {
			setSuccess(true);
		}
	}, [key, count]);

	return success;
};
