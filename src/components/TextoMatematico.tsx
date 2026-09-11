import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { prepararMarkdownAula } from "@/lib/markdown-aula";

export default function TextoMatematico({ texto }: { texto: string }) {
  return <div className="prose prose-slate max-w-none overflow-x-auto break-words">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
      {prepararMarkdownAula(texto)}
    </ReactMarkdown>
  </div>;
}
