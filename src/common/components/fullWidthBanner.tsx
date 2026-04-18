import * as React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

type Props = {
	children: React.ReactNode;
	show?: boolean;
	className?: string;
	closeLabel?: string;
	persistKey?: string;
	resetKey?: string | number | boolean | undefined;
	onClose?: () => void;
};

const DISMISSED_VALUE = "true";

const readDismissedState = (persistKey?: string) => {
	if (!persistKey) {
		return false;
	}

	try {
		const storedValue = localStorage.getItem(persistKey);

		if (storedValue === null) {
			return false;
		}

		const parsedValue = JSON.parse(storedValue);
		return parsedValue === true || parsedValue === DISMISSED_VALUE;
	} catch (error) {
		return false;
	}
};

export function FullWidthBanner({
	children,
	show = true,
	className = "",
	closeLabel = "Close banner",
	persistKey,
	resetKey,
	onClose,
}: Props) {
	const [isDismissed, setIsDismissed] = React.useState(() => readDismissedState(persistKey));

	React.useEffect(() => {
		if (!persistKey) {
			return;
		}

		setIsDismissed(readDismissedState(persistKey));
	}, [persistKey]);

	React.useEffect(() => {
		if (persistKey) {
			return;
		}

		setIsDismissed(false);
	}, [persistKey, resetKey]);

	React.useEffect(() => {
		if (persistKey || !show) {
			return;
		}

		setIsDismissed(false);
	}, [persistKey, show]);

	React.useEffect(() => {
		if (!persistKey || !show) {
			setIsDismissed(false);
			return;
		}

		setIsDismissed(readDismissedState(persistKey));
	}, [persistKey, show]);

	const handleClose = () => {
		setIsDismissed(true);

		if (persistKey) {
			localStorage.setItem(persistKey, JSON.stringify(DISMISSED_VALUE));
		}

		onClose?.();
	};

	if (!show || isDismissed) {
		return null;
	}

	return (
		<div className={`w-full bg-teal-600 text-white ${className}`.trim()}>
			<div className="mx-auto flex min-h-8 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
				<div className="flex-1 text-center text-sm leading-5 sm:text-base">{children}</div>
				<button
					type="button"
					aria-label={closeLabel}
					className="shrink-0 text-white transition hover:text-sky-200"
					onClick={handleClose}
				>
					<AiOutlineCloseCircle size="1.5em" />
				</button>
			</div>
		</div>
	);
}