import React from "react";

export function StandardBoxRow({ children }: { children: React.ReactNode }) {
	return <section className="grid grid-cols-1 gap-2 md:grid-cols-2">{children}</section>;
}
