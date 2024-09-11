import * as React from "react";
import { Container } from "../common/components/container";
import * as Containers from "../common/components/containers";
import { InputWithFloatingLabel } from "../common/components/inputWithFloatingLabel";
import { useDataContext } from "../DataContext";
import { useFetchPlayerProfile } from "../dao/StatApiDao";
import cookie from "js-cookie";
import { queryClient } from "../App";
import Select from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deepEquals } from "../common/utils/object-utils";
import { Toggle } from "../common/components/toggle";
import { FaTrashAlt } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { ProfileJson } from "../models/profile-types";
import * as Form from "../common/components/forms";
import { Input, Radio, RadioGroup } from "@headlessui/react"


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

export function Profile() {
	const { discordUser, players, seasonAndMatchType } = useDataContext();
	const currentPlayer = players.find(p => p.discordId === discordUser?.id);
	const { data: profile, isFetching } = useFetchPlayerProfile(discordUser?.id);
	const [isSaving, setIsSaving] = React.useState(false);
	const [profileSettings, setProfileSettings] = React.useState<Partial<ProfileJson>>();

	React.useEffect(() => {
		setProfileSettings({
		age: profile?.age ?? undefined,
		bio: profile?.bio ?? undefined,
		region: profile?.region ?? undefined,
		isIGL: profile?.isIGL ?? false,
		aspectRatio: profile?.aspectRatio ?? undefined,
		dpi: profile?.dpi ?? undefined,
		inGameSensitivity: profile?.inGameSensitivity ?? undefined,
		favoriteWeapon: profile?.favoriteWeapon ?? undefined,
		favoriteRole: profile?.favoriteRole ?? undefined,
		favoriteMap: profile?.favoriteMap ?? undefined,
		favoriteProPlayer: profile?.favoriteProPlayer ?? undefined,
		favoriteProTeam: profile?.favoriteProTeam ?? undefined,
		socials: profile?.socials ?? {},
		firstCSCSeason: profile?.firstCSCSeason ?? undefined,
		whatExperienceDoYouWant: profile?.whatExperienceDoYouWant ?? undefined,
	});
	}, [profile, isFetching]);

	const weaponOptions = [
		{ label: "AK-47", value: "AK-47" },
		{ label: "M4A4", value: "M4A4" },
		{ label: "M4A1-S", value: "M4A1-S" },
		{ label: "Awp", value: "Awp" },
		{ label: "Sawed-Off", value: "Sawed-Off" },
		{ label: "Famas", value: "Famas" },
		{ label: "Glock", value: "Glock" },
		{ label: "P250", value: "P250" },
		{ label: "UMP-45", value: "UMP-45" },
		{ label: "M249", value: "M249" },
		{ label: "Negev", value: "Negev" },
		{ label: "Five-Seven", value: "Five-Seven" },
		{ label: "Galil", value: "Galil" },
		{ label: "SG-553", value: "SG-553" },
		{ label: "Tec-9", value: "Tec-9" },
		{ label: "Cz75-Auto", value: "Cz75-Auto" },
		{ label: "Desert Eagle", value: "Desert Eagle" },
		{ label: "MAC-10", value: "MAC-10" },
		{ label: "MP9", value: "MP9" },
		{ label: "MP7", value: "MP7" },
		{ label: "P90", value: "P90" },
		{ label: "UMP-45", value: "UMP-45" },
		{ label: "PP-Bizon", value: "PP-Bizon" },
		{ label: "Nova", value: "Nova" },
		{ label: "MP5-SD", value: "MP5-SD" },
		{ label: "MAG-7", value: "MAG-7" },
	];

	const roleOptions = [
		{ label: "Alphapack Leader", value: "Alphapack Leader" },
		{ label: "Fake Flash Abuser", value: "Fake Flash Abuser" },
		{ label: "Entry", value: "Entry" },
		{ label: "Burst Fire is Life", value: "Burst Fire is Life" },
		{ label: "Refragger", value: "Refragger" },
		{ label: "Support", value: "Support" },
		{ label: "Lurker", value: "Lurker" },
		{ label: "Baiter", value: "Baiter" },
		{ label: "Awp Crutch", value: "Awp Crutch" },
		{ label: "Bomb Carrier", value: "Bomb Carrier" },
		{ label: "Site Anchor", value: "Site Anchor" },
		{ label: "Camper", value: "Camper" },
		{ label: "Off Angle McDangle", value: "Off Angle McDangle" },
	];

	const mapOptions = [
		{ label: "de_dust2", value: "de_dust2" },
		{ label: "de_vertigo", value: "de_vertigo" },
		{ label: "de_mirage", value: "de_mirage" },
		{ label: "de_ancient", value: "de_ancient" },
		{ label: "de_anubis", value: "de_anubis" },
		{ label: "de_nuke", value: "de_nuke" },
		{ label: "de_overpass", value: "de_overpass" },
		{ label: "de_inferno", value: "de_inferno" },
	];

	const firstCSCSeasonOptions = [...Array.from({ length: seasonAndMatchType?.season ?? 0 }, (_, i) => i + 1).reverse().map(i => ({ value: i, label: i.toString() }))]

	const ageOptions = ["16-20","21-23","24-26","27-29","30-35","36+"].map((age) => ({ label: age, value: age }));
	const aspectRatioOptions = ["4:3","16:9","16:10","Other???"].map((value) => ({ label: value, value: value }));
	const regionOptions = ["US-East","US-West","US-Central","EU","Other"].map((value) => ({ label: value, value: value }));

	const plans = ['Startup', 'Business', 'Enterprise']

	const onSave = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		fetch("https://tonysanti.com/prx/csc-stat-api/profile", {
			method: "PATCH",
			body: JSON.stringify(profileSettings),
			headers: {
				Authorization: "Bearer " + cookie.get("jwt"),
				"Content-Type": "application/json",
			},
		})
			.then(() => queryClient.invalidateQueries(["profile", discordUser?.id]))
			.finally(() => setIsSaving(false));
	};

	const onChange = (key: string, value: string | number | boolean | Record<string,unknown> | unknown) => {
		setProfileSettings({ ...profileSettings, [key]: value });
	};

	return (
		<Container>
			<div className="mx-auto max-w-lg text-center">
				<h2 className="text-3xl font-bold sm:text-4xl">Your Profile</h2>
				<h3 className="text-xl font-bold sm:text-2xl text-gray-600">Beta</h3>
			</div>
			<p className="mt-4 text-gray-300">Settings & Configuration</p>
			<Containers.StandardBackgroundPage>
				<h1 className="text-xl mb-4">CS:Confederation League Details</h1>
				<div className="flex flex-wrap gap-4">
					<InputWithFloatingLabel
						className="grow text-gray-400"
						label="Tier"
						placeHolder="Tier"
						type="text"
						isDisabled
						onChange={() => {}}
						value={currentPlayer?.tier.name}
					/>
					<InputWithFloatingLabel
						className="grow text-gray-400"
						label="Franchise"
						placeHolder="Franchise"
						type="text"
						isDisabled
						onChange={() => {}}
						value={currentPlayer?.team?.franchise?.name}
					/>
					<InputWithFloatingLabel
						className="grow text-gray-400"
						label="Team"
						placeHolder="Team"
						type="text"
						isDisabled
						onChange={() => {}}
						value={currentPlayer?.team?.name}
					/>
					<InputWithFloatingLabel
						className="grow text-gray-400"
						label="Player Type"
						placeHolder="Player Type"
						type="text"
						isDisabled
						onChange={() => {}}
						value={currentPlayer?.type}
					/>
				</div>
			</Containers.StandardBackgroundPage>
			<br />
			{/* <Containers.StandardBackgroundPage classNames={`${isFetching || isSaving || true ? "" : "hidden"} bg-opacity-75 fixed w-auto`}>
                Loading
            </Containers.StandardBackgroundPage> */}
			<form onSubmit={onSave}>
				<div className="flex flex-col sm:flex-row  flex-wrap gap-4">
					<Containers.StandardBackgroundPage classNames="basis-1/4 grow">
						<Form.FieldSet title="Playstyle">
							<Form.Field title="Are you an IGL?">						
								<div className="inline-block text-center pt-4">
									<Toggle onChange={() => onChange("isIGL", !profileSettings?.isIGL)} checked={profileSettings?.isIGL ?? false} />
								</div>		
							</Form.Field>
							<Form.Field title="Preferred Playstyle">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={roleOptions.find(option => option.value === profileSettings?.favoriteRole)}
									options={roleOptions}
									onChange={option => onChange("favoriteRole", option?.value)}
								/>
							</Form.Field>	
						</Form.FieldSet>
						{ false &&  <div className="basis-1/4 py-1">
							<label className="pl-[0.15rem] px-2 hover:cursor-pointer" htmlFor="">
								Experience Expectations
							</label>
							<RadioGroup value={profileSettings?.whatExperienceDoYouWant} 
								onChange={ option => onChange("whatExperienceDoYouWant", option)} 
								aria-label="Server size"
								>
								{plans.map((plan) => (
									<div key={plan} className="flex items-center gap-2">
										<Radio
											value={plan}						
											className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
										>
											<span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
										</Radio>
										<label>{plan}</label>
									</div>
								))}
							</RadioGroup>
						</div> }
					</Containers.StandardBackgroundPage>
					<Containers.StandardBackgroundPage classNames="basis-1/4 grow">
						<Form.FieldSet title="Favorites">
							<Form.Field title="Weapon">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={weaponOptions.find(
										option => option.value === profileSettings?.favoriteWeapon,
									)}
									options={weaponOptions}
									onChange={option => onChange("favoriteWeapon", option?.value)}
								/>		
							</Form.Field>
							<Form.Field title="Map">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={mapOptions.find(option => option.value === profileSettings?.favoriteMap)}
									options={mapOptions}
									onChange={option => onChange("favoriteMap", option?.value)}
								/>
							</Form.Field>
							<Form.Field title="Pro Team">						
								<Input
									className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"		
									type="text"
									onChange={(e) => onChange("favoriteProTeam", e.currentTarget.value)}
									value={profileSettings?.favoriteProTeam}
								/>
							</Form.Field>
							<Form.Field title="Pro Player">						
								<Input
									className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"		
									type="text"								
									onChange={(e) => onChange("favoriteProPlayer", e.currentTarget.value)}
									value={profileSettings?.favoriteProPlayer}
								/>
							</Form.Field>
						</Form.FieldSet>
					</Containers.StandardBackgroundPage>
					<Containers.StandardBackgroundPage classNames="basis-1/4 grow">
						<Form.FieldSet title="About Me">
							<Form.Field title="Approx. Age">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={ageOptions.find(option => option.value === profileSettings?.age)}
									options={ageOptions}
									onChange={option => onChange("age", option?.value)}
								/>
							</Form.Field>
							<Form.Field title="Region">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={regionOptions.find(option => option.value === profileSettings?.region)}
									options={regionOptions}
									onChange={option => onChange("region", option?.value)}
								/>
							</Form.Field>
							<Form.Field title="First Season">						
							<Select
								placeholder="Not Specified"
								isClearable={true}
								className="grow text-xs"
								unstyled
								isSearchable={false}
								classNames={selectClassNames}
								value={firstCSCSeasonOptions.find(option => option.value === profileSettings?.firstCSCSeason)}
								options={firstCSCSeasonOptions}
								onChange={option => onChange("firstCSCSeason", option?.value)}
							/>
							</Form.Field>
						</Form.FieldSet>
					</Containers.StandardBackgroundPage>
					<Containers.StandardBackgroundPage classNames="basis-1/2 grow">
						<h2 className="text-xl font-bold uppercase text-center mb-2">Socials</h2>
						<SocialFields profileSettings={profileSettings} onChange={(socials: Record<string,string>) => onChange("socials", socials)} />
					</Containers.StandardBackgroundPage>
					<Containers.StandardBackgroundPage classNames="basis-1/4">
						<Form.FieldSet title="In-Game">
							<Form.Field title="Aspect Ratio">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isSearchable={false}
									classNames={selectClassNames}
									value={aspectRatioOptions.find(option => option.value === profileSettings?.aspectRatio)}
									options={aspectRatioOptions}
									onChange={option => onChange("aspectRatio", option?.value)}
								/>
							</Form.Field>
							<Form.Field title="DPI">						
								<Input
									type="text"
									className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"		
									onChange={(e) => onChange("dpi", e.currentTarget.value)}
									value={profileSettings?.dpi}
								/>
							</Form.Field>
							<Form.Field title="Sens">						
								<Input
									className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"		
									type="text"								
									onChange={(e) => onChange("inGameSensitivity", e.currentTarget.value)}
									value={profileSettings?.inGameSensitivity}
								/>
							</Form.Field>
						</Form.FieldSet>				
					</Containers.StandardBackgroundPage>
				</div>
				{ !deepEquals(profile ?? {}, profileSettings ?? {}) &&
				<div className="py-2 flex justify-end">
					<button onClick={onSave} disabled={isSaving} className="flex flex-row bg-blue-500 text-white px-4 py-2 rounded">
						{isSaving && (
							<div className="animate-spin h-[1em] w-[1em] m-1">
								<AiOutlineLoading3Quarters />
							</div>
						)}
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
				}
			</form>
		</Container>
	);
}
