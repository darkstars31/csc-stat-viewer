import * as React from "react";

import { cn } from "@/lib/utils";

const tableBorderClassName = "border-b border-white/8";

const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<"table">>(function Table(
	{ className, ...props },
	ref,
) {
	return <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />;
});

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"thead">>(function TableHeader(
	{ className, ...props },
	ref,
) {
	return <thead ref={ref} className={cn("font-medium", className)} {...props} />;
});

const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tbody">>(function TableBody(
	{ className, ...props },
	ref,
) {
	return <tbody ref={ref} className={cn("[&_tr:last-child_td]:border-b-0", className)} {...props} />;
});

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<"tr">>(function TableRow(
	{ className, ...props },
	ref,
) {
	return <tr ref={ref} className={cn(tableBorderClassName, className)} {...props} />;
});

const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"th">>(function TableHead(
	{ className, ...props },
	ref,
) {
	return (
		<th
			ref={ref}
			className={cn(
				tableBorderClassName,
				"px-6 py-4 text-left align-middle whitespace-nowrap",
				className,
			)}
			{...props}
		/>
	);
});

const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"td">>(function TableCell(
	{ className, ...props },
	ref,
) {
	return (
		<td
			ref={ref}
			className={cn(tableBorderClassName, "px-6 py-4 align-middle whitespace-nowrap", className)}
			{...props}
		/>
	);
});

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };