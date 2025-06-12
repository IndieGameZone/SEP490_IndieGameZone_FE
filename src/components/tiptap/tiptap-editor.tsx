import {
  Editor,
  EditorContent,
  useEditor,
} from "@tiptap/react";
import {
  FaBold,
  FaCode,
  FaEraser,
  FaItalic,
  FaList,
  FaListOl,
  FaMinus,
  FaParagraph,
  FaQuoteRight,
  FaRedo,
  FaRemoveFormat,
  FaStrikethrough,
  FaUndo,
  FaYoutube,
} from "react-icons/fa";
import { extensions } from "./extensions";
import { cn } from "@/lib/utils";
import { Button, Input } from "antd";
import {
  LuCornerDownLeft,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuSquareCode,
  LuWrapText,
} from "react-icons/lu";
import { useEffect } from "react";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const handleAddYoutube = () => {
    const url = prompt("Enter Youtube URL");
    if (url) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: url || "https://www.youtube.com/watch?v=WH5w7YQ9wzY",
          width: 640,
          height: 360,
        })
        .run();
    }
  };

  // const handleClickAddOpenFile = () => {
  //     fileInputRef.current?.click();
  // };

  return (
    <>
      <div className="flex gap-2 flex-wrap sticky top-0 z-10 py-2 px-2 border-b mb-4 bg-zinc-900">
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "" : ""}
          type={editor.isActive("bold") ? "primary" : "default"}
        >
          <FaBold className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          type={editor.isActive("italic") ? "primary" : "default"}
        >
          <FaItalic className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          type={editor.isActive("strike") ? "primary" : "default"}
        >
          <FaStrikethrough className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          type={editor.isActive("code") ? "primary" : "default"}
        >
          <FaCode className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <FaEraser className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          <FaRemoveFormat className="w-4 h-4" />
        </Button>
        <Input
          type="color"
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes("textStyle").color ?? "#000000"}
          data-testid="setColor"
          style={{ maxWidth: 100 }}
        />
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          type={editor.isActive("paragraph") ? "primary" : "default"}
        >
          <FaParagraph className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          type={
            editor.isActive("heading", { level: 1 }) ? "primary" : "default"
          }
        >
          <LuHeading1 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          type={
            editor.isActive("heading", { level: 2 }) ? "primary" : "default"
          }
        >
          <LuHeading2 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          type={
            editor.isActive("heading", { level: 3 }) ? "primary" : "default"
          }
        >
          <LuHeading3 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          type={
            editor.isActive("heading", { level: 4 }) ? "primary" : "default"
          }
        >
          <LuHeading4 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          type={
            editor.isActive("heading", { level: 5 }) ? "primary" : "default"
          }
        >
          <LuHeading5 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          type={
            editor.isActive("heading", { level: 6 }) ? "primary" : "default"
          }
        >
          <LuHeading6 className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FaList className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FaListOl className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <FaMinus className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type={editor.isActive("codeBlock") ? "primary" : "default"}
        >
          <LuSquareCode className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type={editor.isActive("blockquote") ? "primary" : "default"}
        >
          <FaQuoteRight className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <LuWrapText className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <LuCornerDownLeft className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <FaUndo className="w-4 h-4" />
        </Button>
        <Button
          htmlType="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <FaRedo className="w-4 h-4" />
        </Button>
        <Button htmlType="button" onClick={() => handleAddYoutube()}>
          <FaYoutube className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
const TiptapEditor = ({
  value = "<p></p>",
  onChange = () => {},
  className,
  darkTheme = true,
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  darkTheme?: boolean;
}) => {
  const editor = useEditor({
    extensions: extensions,
    content: value,
    editable: true,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          `prose
          leading-normal
          prose-headings:my-2 
          prose-strong:text-white
          prose-ul:m-0
          prose-p:m-0 
          prose-li:m-0
          max-w-none 
          prose-ol:list-decimal 
          prose-ul:list-disc 
          prose-hr:my-5
          outline-none 
          p-5`,
          darkTheme &&
            `
            text-white 
            prose-headings:text-white 
            prose-hr:border-white 
            prose-blockquote:text-white
            `,
          className
        ),
      },
    },
  });
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, false); // false = don't emit another update event
    }
  }, [value, editor]);
  return (
    <div
      className={`border rounded overflow-hidden ${
        darkTheme ? "bg-zinc-800 border-zinc-600" : "bg-white border-gray-300"
      } ${className}`}
    >
      {/* render your menu bar, passing the editor instance */}
      {editor && <MenuBar editor={editor} />}
      {/* this is the actual editable area */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
