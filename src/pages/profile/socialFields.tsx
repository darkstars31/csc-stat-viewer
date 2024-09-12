import * as React from "react";
import { FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import { selectClassNames } from "../../common/utils/select-utils";
import { Input } from "@headlessui/react";
import { CgAdd } from "react-icons/cg";


export function SocialFields( { onChange, profileSettings }: { onChange: (x: Record<string, string>) => void, profileSettings: Partial<{ socials: Record<string, string>}> | undefined} ) {
	const [ addSocial, setAddSocial ] = React.useState({ key: "twitter/x", value: "" });
	const socials = profileSettings?.socials || {};

	const socialOptions = [
		{ label: "Twitter/X", value: "twitter/x", url: "https://x.com/" },
		{ label: "Reddit", value: "reddit", url: "https://reddit.com/u/" },
		{ label: "Twitch", value: "twitch", url: "https://twitch.com/" },
		{ label: "YouTube", value: "youtube", url: "https://youtube.com/" },
		{ label: "TikTok", value: "tiktok", url: "https://tiktok.com/@" },
		{ label: "Instagram", value: "instagram", url: "https://instagram.com/" },
		{ label: "Personal Discord", value: "discord", url: "https://discord.gg/" },
		{ label: "Medal.tv", value: "medal.tv", url: "https://medal.tv/u/" },
	].filter( option => !socials[option.value] );

	return (
		<div className="relative content-between h-full m-4 pb-6">
			<div className="flex flex-col justify-between text-sm m-2">
			{
				Object.entries(profileSettings?.socials ?? {}).map(([key, value], index) => (
					<div className="flex flex-row">
						<div className="grow">{value}</div>
						<div className="w-6"><FaTrashAlt onClick={() =>{ const s = {...socials}; delete s[key]; onChange(s)}} /></div>
					</div>
				))
			}
			</div>
			<div className="absolute bottom flex flex-row text-xs w-full mb-4">
				<Select
					isClearable={false}
					className="basis-2/12"
					unstyled
					isSearchable={false}
					classNames={selectClassNames}
					defaultValue={socialOptions.at(0)}
					value={socialOptions.find(
						option => option.value === addSocial.key,
					)}
					options={socialOptions}
					onChange={option => setAddSocial({  ...addSocial, key: option?.value ?? "" })}
				/>
				<Input
					className="grow my-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"		
					type="text"
					placeholder="Just your social id"
					onChange={e => setAddSocial({ ...addSocial, value: e.currentTarget.value.trim()})}
					value={addSocial.value}
				/>
				<div className="pt-0.5">
					<button 
						onClick={(e) => {e.preventDefault(); onChange({ ...socials, [addSocial.key]: socialOptions.find(option => option.value === addSocial.key)?.url + addSocial.value })}} 
						className={`flex flex-row m-1 p-2 ${!addSocial.value ? "bg-slate-600/25 hover:cursor-not-allowed" : "bg-blue-600"} text-white rounded`}
						disabled={!addSocial.value}
						>
						<CgAdd className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	)
}