"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function ChatPreview({ chat, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {chat.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                  message.role === "user" ? "bg-[#FFFFFF]" : "bg-[#EBF5FF]"
                }`}
              >
                {message.role === "user" ? (
                  <span className="text-xl">👤</span>
                ) : (
                  <span className="text-xl">🤖</span>
                )}
              </div>
              <div
                className={`flex-1 overflow-hidden ${
                  message.role === "user" ? "bg-[#FFFFFF]" : "bg-[#EBF5FF]"
                } rounded-lg p-3`}
              >
                {message.role === "user" ? (
                  message.content.toLowerCase().trim().startsWith("/rag") ? (
                    <p className="text-base text-gray-900 whitespace-pre-line">
                      <b>/RAG</b> {message.content.trim().slice(4)}
                    </p>
                  ) : (
                    <p className="text-base text-gray-900 whitespace-pre-line">
                      {message.content}
                    </p>
                  )
                ) : (
                  <div className="prose prose-sm prose-blue max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="whitespace-pre-line">{children}</p>
                        ),
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              {...props}
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...props} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
