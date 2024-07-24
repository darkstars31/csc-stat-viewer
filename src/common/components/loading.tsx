import * as React from "react";

type Props = {
	message?: string;
};

export function Loading({ message }: Props) {
	const funLoadingMessages = [
		"Loading...",
		"Hang on tight!",
		"Reticulating splines...",
		"Summoning the data...",
		"Counting to infinity...",
		"Spinning up the hard drive...",
		"Loading stats for you...",
		"Assembling the bits and bytes...",
		"Checking for hidden easter eggs...",
		"Boosting mid...",
		"Locking and loading...",
		"Planting default...",
		"Planting the bomb...",
		"Dropping the bomb...",
		"Ninjaing the bomb...",
		"Defusing...",
		"Clearing dust from the vents...",
		"Info Peak...",
		"Loading the ego Peak...",
		"Warming up the AWP...",
		"Smoking mid...",
		"Flashing long...",
		"Flashing short...",
		"Inspecting knives for extra style points...",
		"Checking corners like a pro...",
		"Adjusting crosshair for maximum accuracy...",
		"Buy the defuser, be the defuser...",
		"Don't forget to buy a kit...",
		"Demo Reviewing...",
		"VOD Review time...",
		"Eco round...",
		"They talk about my One Taps...",
		"Wallbanging...",
		"Wiffing...",
		"Sneaky breeky...",
		"One Tap...",
		"Loading Keagooobot...",
		"Loadzino...",
		"Executing A...",
		"Loading Weagle...",
	];

	const randomNumber = Math.floor(Math.random() * funLoadingMessages.length);

	return (
		<div className="mx-auto text-xl justify-center flex flex-box">
			<svg
				className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			{message ? message : funLoadingMessages[randomNumber]}
		</div>
	);
}
