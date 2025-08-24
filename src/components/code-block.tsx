import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "antd";
import { FaRegCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
  code: string;
  language: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function CodeBlock({ code, language, ...rest }: CodeBlockProps) {
  const { isCopied, copyToClipboard } = useClipboard();
  return (
    <div className="relative rounded-md overflow-hidden" {...rest}>
      <div className="flex justify-between items-center bg-zinc-800 text-white text-sm px-2 py-1">
        <span className="p-1">{language}</span>
        <Button
          icon={<FaRegCopy />}
          type="text"
          size="small"
          onClick={() => copyToClipboard(code)}
        >
          {isCopied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ marginBlock: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
