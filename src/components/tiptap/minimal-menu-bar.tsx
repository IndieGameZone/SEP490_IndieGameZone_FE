import { Editor } from "@tiptap/react";
import { Button, Input } from "antd";
import {
  FaBold,
  FaCode,
  FaEraser,
  FaItalic,
  FaMinus,
  FaQuoteRight,
  FaRedo,
  FaRemoveFormat,
  FaStrikethrough,
  FaUndo,
} from "react-icons/fa";
import { LuCornerDownLeft, LuSquareCode, LuWrapText } from "react-icons/lu";

const MinimalMenuBar = ({ editor }: { editor: Editor }) => {
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
      </div>
    </>
  );
};

export default MinimalMenuBar;
