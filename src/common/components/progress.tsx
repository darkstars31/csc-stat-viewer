import * as React from "react";

export function ProgressBar() {
	const [value, setValue] = React.useState(0);
	const progressBarSpeed = 12;

	React.useEffect(() => {
		setTimeout(() => {
			const newValue = value < 100 ? value + 1 + value / progressBarSpeed : 0;
			setValue(newValue);
		}, 8);
	}, [value]);

	return (
		<div className="w-screen h-1 bg-inherit">
			<div className="z-1 h-1 bg-cyan-400" style={{ width: `${value}%` }}></div>
		</div>
	);
}
