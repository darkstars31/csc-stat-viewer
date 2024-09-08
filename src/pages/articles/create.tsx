import * as React from "react";
import { Container } from "../../common/components/container";
import { InputWithFloatingLabel } from "../../common/components/inputWithFloatingLabel";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const CreatePost = () => {
	const [title, setTitle] = React.useState<string>("");
	//const [ tags, setTags ] = React.useState("");
	const [content, setContent] = React.useState<EditorState | undefined>(EditorState.createEmpty());

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
					<Editor
						editorState={content}
						toolbarClassName="toolbarClassName"
						wrapperClassName="wrapperClassName"
						editorClassName="editorClassName"
						onEditorStateChange={setContent}
					/>
				</div>
				<div className="py-4 flex flex justify-end">
					<button>Submit</button>
				</div>
			</form>
		</Container>
	);
};
