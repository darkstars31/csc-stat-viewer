import * as React from "react";
import { Container } from "../../common/components/container";
import { InputWithFloatingLabel } from "../../common/components/inputWithFloatingLabel";
import '@mdxeditor/editor/style.css'

import {
	toolbarPlugin,
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
	KitchenSinkToolbar,
	linkPlugin,
	linkDialogPlugin,
	imagePlugin,
	tablePlugin,
	frontmatterPlugin,
	codeBlockPlugin,
	codeMirrorPlugin,
  } from '@mdxeditor/editor'

export const CreatePost = () => {
	const [title, setTitle] = React.useState<string>("");
	const editorRef = React.useRef<MDXEditorMethods>(null);
	//const [ tags, setTags ] = React.useState("");
	const [content, setContent] = React.useState<string>("");

	return (
		<Container>
			<div>Create</div>
			<form>
				<div className="py-4">
					<InputWithFloatingLabel
						type="text"
						placeHolder="Title"
						label="Title"
						value={title}
						onChange={e => setTitle(e.currentTarget.value)}
					/>
				</div>
				<div></div>
				<div>
					<MDXEditor
						className="dark-theme dark-editor p-2 border border-gray-600"
						plugins={[
							toolbarPlugin({toolbarContents: () => {
								 return (
									<KitchenSinkToolbar />
					  			)}
							}),
							listsPlugin(),
							quotePlugin(),
							headingsPlugin(),
							linkPlugin(),
							linkDialogPlugin(),
							imagePlugin(),
							tablePlugin(),
							thematicBreakPlugin(),
							frontmatterPlugin(),
							codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),							
							codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),							
							markdownShortcutPlugin()
						]}
						onChange={setContent}
						ref={editorRef} 
						markdown={content}
					/>
				</div>
				<div className="py-4 flex flex justify-end">
					<button>Submit</button>
				</div>
			</form>
		</Container>
	);
};
