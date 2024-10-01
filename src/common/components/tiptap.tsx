import * as React from 'react'
import { EditorProvider, FloatingMenu, BubbleMenu, useCurrentEditor, Editor } from '@tiptap/react'
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from '@tiptap/starter-kit'
import './tiptap.scss'
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiCodeSSlashLine,
    RiEmotionLine,
    RiH1,
    RiH2,
    RiH3,
    RiH4,
    RiH5,
    RiH6,
    RiParagraph,
    RiListOrdered,
    RiListUnordered,
    RiCodeBoxLine,
    RiLink,
    RiLinkUnlink,
    RiDoubleQuotesL,
    RiSeparator,
    RiTextWrap,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
} from 'react-icons/ri'

const extensions = [StarterKit, Color.configure({ types: [TextStyle.name, ListItem.name] })]

const MenuBar = () => {
    const { editor } = useCurrentEditor();
  
    if (!editor) {
      return null;
    }
  
    return (
            <div className={'ToolbarContainer'}>
                <div className="Toolbar">
                    <div className="icon" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <RiBold />
                    </div>
                    <div className="icon" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <RiItalic />
                    </div>
                    <div className="icon" onClick={() => editor.chain().focus().toggleStrike().run()}>
                        <RiStrikethrough />
                    </div>
                    <div className="icon" onClick={() => editor.chain().focus().toggleCode().run()}>
                        <RiCodeSSlashLine />
                    </div>
                    <div className="divider"></div>
                    {/* <div
                        className="icon"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .insertEmoji(sample(['😀', '😁', '😂', '😎', '😍', '😱']) as string)
                                .run()
                        }>
                        <RiEmotionLine />
                    </div> */}
                    <div className="divider"></div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                        <RiH1 />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        <RiH2 />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                        <RiH3 />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
                        <RiH4 />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
                        <RiH5 />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}>
                        <RiH6 />
                    </div>
                    <div className="icon" onClick={() => editor.chain().focus().setParagraph().run()}>
                        <RiParagraph />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <RiListOrdered />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        <RiListUnordered />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                        <RiCodeBoxLine />
                    </div>
                    <div className="divider"></div>
                    {/* <div className="icon" onClick={() => setLink(editor)}>
                        <RiLink />
                    </div>
                    <div
                        className={classNames('icon', { disabled: !isCursorOverLink })}
                        onClick={() => setLink(editor)}>
                        <RiLinkUnlink />
                    </div> */}
                    <div className="divider"></div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                        <RiDoubleQuotesL />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <RiSeparator />
                    </div>
                    <div className="divider"></div>
                    <div className="icon" onClick={() => editor.chain().focus().setHardBreak().run()}>
                        <RiTextWrap />
                    </div>
                    <div
                        className="icon"
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                        <RiFormatClear />
                    </div>
                    <div className="divider"></div>
                    <div className="icon" onClick={() => editor.chain().focus().undo().run()}>
                        <RiArrowGoBackLine />
                    </div>
                    <div className="icon" onClick={() => editor.chain().focus().redo().run()}>
                        <RiArrowGoForwardLine />
                    </div>
                </div>
            </div>
        )
  };

const Tiptap = ( { content, onUpdate }: { content: string, onUpdate:({ editor }: { editor?: Editor}) => void }) => {
  return (
    <EditorProvider extensions={extensions} content={content} onUpdate={onUpdate} slotBefore={<MenuBar />} >
      {/* <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu> */}
    </EditorProvider>
  )
}

export default Tiptap