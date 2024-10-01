import * as React from "react";
import { Container } from "../../common/components/container";

import '@mdxeditor/editor/style.css'
import * as Form from "../../common/components/forms";

import Tiptap from "../../common/components/tiptap";
import { StandardBackgroundPage, StandardContentBox } from "../../common/components/containers";
import { Input } from "@headlessui/react";
import { useLocalStorage } from "../../common/hooks/localStorage";
import { analytikillHttpClient } from "../../dao/httpClients";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Toggle } from "../../common/components/toggle";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { Pill } from "../../common/components/pill";
import { useLocation } from "wouter";
import { useDataContext } from "../../DataContext";

export const CreatePost = () => {
	const { discordUser } = useDataContext();
	const [_, setLocation] = useLocation();
	const [title, setTitle] = React.useState<string>("");
	const [subTitle, setSubTitle] = React.useState<string>("");
	const [bannerURL, setBannerURL] = React.useState<string>("");
	const [ tagInput, setTagInput ] = React.useState<string>("");
	const [ tags, setTags ] = React.useState<string[]>([]);
	const [ isAnonymous, setAnonymous ] = React.useState(false);
	const [ isSubmitting, setSubmitting ] = React.useState(false);
	const [content, setContent] = useLocalStorage('draftPost',"<br /><br /><br /><br />");

	const handleSubmit = async () => {
		setSubmitting(true);
		await analytikillHttpClient.post('/analytikill/article', {
			title,
			subtitle: subTitle,
			bannerURL,
			tags,
			content,
			isAnonymous,
		}).then( response => {
			setContent("<br /><br /><br />");
			setLocation(`/articles/submitted`);
		}).finally(() => {
			setSubmitting(false);
		});
	}

	const addTag = () => {
		setTagInput("");
		const newFilters = [...tags, tagInput].filter(Boolean);
		setTags(newFilters);
	};

	const removeTag = (tag: string) => {
		const newFilters = tags;
		delete newFilters[tags.indexOf(tag)];
		setTags(newFilters.filter(Boolean));
	};

	if(!discordUser) {
		return (
			<Container>
				<div className="m-4 p-4">
					<div>You must be logged in to create a post.</div>
				</div>
			</Container>		
		)
	}

	const expression = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/gi;
	const regex = new RegExp(expression);

	return (
		<Container>
			<div className="m-4 p-4">
				<div>Create a Post</div>
				<div className="flex flex-row gap-4 flex-wrap">
					<div className="basis-1/2">
						<Form.Field title="Title" isValid={title !== "" && title.length > 2} errorMessage="Title must be at least 3 characters">						
							<Input
								className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
								placeholder="Head Liner"	
								type="text"
								onChange={(e) => setTitle(e.currentTarget.value)}
								value={title}
							/>
						</Form.Field>
						<Form.Field title="Sub Title">						
							<Input
								className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
								placeholder="Sub header (optional)"	
								type="text"
								onChange={(e) => setSubTitle(e.currentTarget.value)}
								value={subTitle}
							/>
						</Form.Field>
					</div>
						<div className="basis-1/3">
							<Form.Field title="Banner URL" isValid={regex.test(bannerURL)} errorMessage="Invalid URL">						
								<Input
									className="grow mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
									placeholder="Banner Image URL"	
									type="text"
									onChange={(e) => setBannerURL(e.currentTarget.value)}
									value={bannerURL}
								/>
							</Form.Field>
							<div className="basis-1/3">
								{ bannerURL && <img className="mt-3 h-32 w-96" src={bannerURL} /> }
							</div>
						</div>
				</div>						
				<div className="min-h-64 m-6 p-5 rounded-xl bg-midnight2 bg-opacity-80">
					<Tiptap content={content} onUpdate={(e) => setContent(e.editor?.getHTML() ?? "")} />
					<div className="flex justify-between gap-4 mt-2 pt-2 border-t border-gray-500">
						<div className="flex flex-row">
							<Form.Field title="" className="relative flex flex-row">						
								<Input
									className="mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
									placeholder="Add a tag or two"	
									type="text"
									onChange={(e) => setTagInput( (e.currentTarget.value.replace(/\s/g, '') ) )}
									value={tagInput}
								/>
								<button className="absolute right-0 top-3 bg-blue-500 text-white px-3 py-[.4rem] rounded-lg" onClick={addTag} type="button">Add</button>
							</Form.Field>						
						</div>
						<div>
							{ tags.map( (tag, index) => 
								<Pill key={tag} label={`#${tag}`} onClick={() => removeTag(tag)} />
							)}
						</div>
						<div className="flex flex-row">
							<Form.Field title="Post Anonymously">
								<ToolTip type="explain" message={`If checked, the post will be submitted as you but your name will not be visible once it is approved.`}>
									<IoMdInformationCircleOutline className="inline m-2 p-2" />
								</ToolTip>						
								<div className="inline-block pt-4">
									<Toggle onChange={() => setAnonymous(!isAnonymous)} checked={isAnonymous ?? false} />
								</div>		
							</Form.Field>	
							<button onClick={handleSubmit} disabled={isSubmitting} className="flex flex-row bg-blue-500 text-white px-4 py-2 rounded">
								{isSubmitting && (
									<div className="animate-spin h-[1em] w-[1em] m-1">
										<AiOutlineLoading3Quarters />
									</div>
								)}
								{isSubmitting ? "Saving..." : "Submit"}
							</button>
						</div>					
					</div>
				</div>
			</div>				
		</Container>
	);
};
