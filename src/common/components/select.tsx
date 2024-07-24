import * as React from "react";

type Props = {
	label: string;
	options: { id: number | string; value: string }[];
	onChange: (value: React.FormEvent<HTMLSelectElement>) => void;
	value: string;
};

export function Select({ label, value, options, onChange }: Props) {
	return (
		<div className="flex flex-box">
			<legend className="block mt-1 pr-2 text-sm font-medium text-gray-400">{label}</legend>

			<div className="mt-1 -space-y-px bg-inherit rounded-md shadow-sm">
				<div>
					<label htmlFor={label.toLowerCase()} className="sr-only">
						{label}
					</label>

					<select
						id={label.toLowerCase()}
						className="relative w-full bg-inherit border-gray-200 rounded-md focus:z-10 sm:text-sm"
						onChange={onChange}
						value={value}
					>
						{options.map(option => (
							<option
								className="bg-slate-600 text-slate-300"
								key={option?.id ?? option}
								value={option?.id ?? option}
							>
								{option?.value ?? option}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
