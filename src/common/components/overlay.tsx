import * as React from "react";

export function Overlay({ condition, message }: { condition: boolean; message: string | React.ReactNode }) {
	const [isClosed, setIsClosed] = React.useState(false);

	return condition && !isClosed ?
			<div className="absolute flex inset-0 backdrop-opacity-30 backdrop-brightness-90 bg-black/[.65] z-40">
				<div className="m-auto text-center text-white text-lg font-bold">
					{message}
					<div className="text-xs text-gray-600">
						..or you can close this overlay by{" "}
						<button onClick={() => setIsClosed(true)} className="hover:text-blue-500 cursor-pointer">
							clicking here
						</button>
					</div>
				</div>
			</div>
		:	null;
}
