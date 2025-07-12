import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const TiptapView = ({
  value = "<p></p>",
  className,
  darkTheme = true,
}: {
  value?: string;
  className?: string;
  darkTheme?: boolean;
}) => {
  const editor = useEditor({
    extensions: extensions,
    content: value,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose leading-normal max-w-none outline-none",
          "prose-headings:my-2 prose-ul:m-0 prose-p:m-0 prose-li:m-0",
          "prose-ol:list-decimal prose-ul:list-disc prose-hr:my-5",
          darkTheme
            ? "text-zinc-300 prose-headings:text-white prose-hr:border-white prose-blockquote:text-white prose-code:text-green-400 prose-strong:text-white"
            : "text-zinc-800 prose-headings:text-black prose-hr:border-black prose-blockquote:text-black prose-code:text-emerald-700 prose-strong:text-black",
          className
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapView;
