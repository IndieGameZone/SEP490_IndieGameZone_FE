import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import MenuBar from "./menu-bar";
import MinimalMenuBar from "./minimal-menu-bar";

const TiptapEditor = ({
  value = "<p></p>",
  onChange = () => {},
  className,
  darkTheme = true,
  type = "full",
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  darkTheme?: boolean;
  type?: "minimal" | "full";
}) => {
  const editor = useEditor({
    extensions: extensions,
    content: value,
    editable: true,
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        onChange("");
      } else {
        onChange(editor.getHTML());
      }
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
            prose-code:text-green-400
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
      {editor &&
        (type == "full" ? (
          <MenuBar editor={editor} />
        ) : (
          <MinimalMenuBar editor={editor} />
        ))}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
