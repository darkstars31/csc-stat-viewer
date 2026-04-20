import * as React from "react";

import { cn } from "@/lib/utils";

type AvatarProps = React.ComponentPropsWithoutRef<"div"> & {
	src?: string | null;
	alt?: string;
	fallback?: React.ReactNode;
	imageClassName?: string;
};

export function Avatar({ className, src, alt, fallback, imageClassName, ...props }: AvatarProps) {
	const [imageFailed, setImageFailed] = React.useState(false);

	React.useEffect(() => {
		setImageFailed(false);
	}, [src]);

	return (
		<div
			className={cn(
				"inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-xs font-medium text-muted-foreground",
				className,
			)}
			{...props}
		>
			{src && !imageFailed ? (
				<img
					className={cn("size-full object-cover", imageClassName)}
					src={src}
					alt={alt ?? ""}
					loading="lazy"
					onError={() => setImageFailed(true)}
				/>
			) : (
				fallback ?? <span aria-hidden="true">?</span>
			)}
		</div>
	);
}