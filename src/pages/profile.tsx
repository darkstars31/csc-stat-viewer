import * as React from "react";
import { Container } from "../common/components/container";
import * as Containers from "../common/components/containers";
import { InputWithFloatingLabel } from "../common/components/inputWithFloatingLabel";
import { useDataContext } from "../DataContext";
import { useFetchPlayerProfile } from "../dao/StatApiDao";
import { queryClient } from "../App";
import Select from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { deepEquals } from "../common/utils/object-utils";
import { Toggle } from "../common/components/toggle";
import { ProfileJson } from "../models/profile-types";
import * as Form from "../common/components/forms";
import { Input, Radio, RadioGroup } from "@headlessui/react"
import { SocialFields } from "./profile/socialFields";
import { gaEvent } from "../common/services/google-analytics";
import { analytikillHttpClient } from "../dao/httpClients";
import { CheckCircleIcon } from "@heroicons/react/24/outline";



export function Profile() {
	const { discordUser, players, seasonAndMatchType, loggedinUser } = useDataContext();
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
		iglExperience: profile?.iglExperience ?? undefined,
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
		"Alphapack Leader",
		"Fake Flash Abuser",
		"Entry",
		"Burst Fire is Life",
		"Refragger",
		"Support", 
		"Lurker", 
		"Baiter",
		"Awp Crutch", 
		"Bomb Carrier", 
		"Weagle Enjoyer", 
		"Site Anchor",
		"Captain Team Flash",
		"Camper",
		"Off Angle McDangle",
	].map((role) => ({ label: role, value: role }));

	const iglExperienceOptions = ["0", "1", "2", "3+"].map((igl) => ({ label: igl, value: igl }));
	const mapOptions = [
		"de_dust2",
		"de_vertigo", 
		"de_mirage",
		"de_ancient", 
		"de_anubis",
		"de_nuke",
		"de_overpass",
		"de_inferno", 
	].map((map) => ({ label: map, value: map }));

	const firstCSCSeasonOptions = [...Array.from({ length: seasonAndMatchType?.season ?? 0 }, (_, i) => i + 1).reverse().map(i => ({ value: i, label: i.toString() }))]

	const ageOptions = ["16-20","21-23","24-26","27-29","30-35","36+"].map((age) => ({ label: age, value: age }));
	const aspectRatioOptions = ["4:3","16:9","16:10","Other???"].map((value) => ({ label: value, value: value }));
	const regionOptions = ["US-East","US-West","US-Central","EU","Other"].map((value) => ({ label: value, value: value }));

	const onSave = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		analytikillHttpClient.patch(`/profile`, 
				profileSettings	
			)
			.then(() => queryClient.invalidateQueries({ queryKey:["profile", discordUser?.id]}))
			.finally(() => { 
				setIsSaving(false); 
				gaEvent("Profile", "Save", loggedinUser ) 
			});
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
							<Form.Field title="Season(s) as an IGL">						
								<Select
									placeholder="Not Specified"
									isClearable={true}
									className="grow text-xs"
									unstyled
									isDisabled={!profileSettings?.isIGL}
									isSearchable={false}
									classNames={selectClassNames}
									value={iglExperienceOptions.find(option => option.value === profileSettings?.iglExperience)}
									options={iglExperienceOptions}
									onChange={option => onChange("iglExperience", option?.value)}
								/>
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
