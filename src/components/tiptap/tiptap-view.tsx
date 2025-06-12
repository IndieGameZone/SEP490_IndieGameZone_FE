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
          `,
          darkTheme &&
            `
            text-zinc-300 
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
