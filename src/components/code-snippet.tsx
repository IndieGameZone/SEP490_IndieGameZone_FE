import { ReactNode } from "react";

interface CodeSnippet {
  children: ReactNode;
  className?: string;
}
const CodeSnippet = ({ children, className = "" }: CodeSnippet) => (
  <code
    className={`px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded ${className}`}
  >
    {children}
  </code>
);

export default CodeSnippet;
