"use client";
import api from "@/service/api";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [maxTokens, setMaxTokens] = useState(8192);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Function to normalize text by removing excessive line breaks
  const normalizeText = (text) => {
    return text
      .replace(/\n{3,}/g, "\n\n") // Replace 3 or more line breaks with 2
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const newUserMessage = { role: "user", content: message };
      setChats((prev) => [...prev, newUserMessage]);
      setMessage(""); // Clear input right away for better UX
      const requestBody = {
        chats: [...chats, newUserMessage], // Include the new message
        max_token: maxTokens,
      };
      const { data } = await api.post(
        "/api/prompt",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setChats((prev) => [
        ...prev,
        { role: "assistant", content: normalizeText(data.response) },
      ]);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxTokensChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxTokens(value);
  };

  useEffect(() => {
    setIsMounted(true);
    const savedChats = localStorage.getItem("chats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        setChats([]);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex flex-col flex-1 h-[90dvh] pb-4">
        <div className="flex items-start justify-between gap-3 mt-4">
          <div className="flex-1 overflow-y-auto">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-[90dvh] pb-4">
      <div className="flex items-start justify-between gap-3 mt-4">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800">
              Trigger our Posterio RAG as a PM Assistant by starting a chat with{" "}
              <b>/RAG</b> then continue with your prompt.
            </p>
            <p className="text-blue-800 mt-4">
              <b>/RAG</b> I&apos;m planning to build an inventory management
              system. Who would you recommend from our IT talent to develop this
              app?
            </p>
          </div>
        </div>

        {/* Token Counter */}
        <div className="flex bg-white px-2 w-72">
          <div className="flex flex-col w-full">
            <span className="text-gray-600 font-semibold">Max Tokens:</span>
            <div className="flex items-start gap-3 w-full">
              <div className="flex-1">
                <div className="relative w-full">
                  <input
                    type="range"
                    value={maxTokens}
                    onChange={handleMaxTokensChange}
                    className="absolute w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                    min={512}
                    max={8192}
                    step={1}
                  />
                  <div
                    className="absolute h-2 bg-blue-500 rounded-full"
                    style={{
                      width: `${((maxTokens - 512) / (8192 - 512)) * 100}%`,
                      zIndex: 0,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between pr-1 mt-3">
                  <span className="text-gray-600">512</span>
                  <span className="text-gray-600">8,192</span>
                </div>
              </div>
              <span className="text-right text-gray-600 w-10 -mt-2">
                {maxTokens.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col flex-1 items-between bg-white pt-5">
        <div className="flex grow flex-1 flex-col gap-6 overflow-y-auto max-h-[68dvh]">
          {chats
            .filter((chat) => chat.role !== "system")
            .map((chat, index) => (
              <div key={index} className="flex flex-col">
                <div
                  className={`flex items-start gap-2.5 ${
                    chat.role === "user" ? "flex-row" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      chat.role === "user" ? "bg-gray-100" : "bg-[#EBF5FF]"
                    }`}
                  >
                    {chat.role === "user" ? (
                      <span className="text-xl">👤</span>
                    ) : (
                      <span className="text-xl">🤖</span>
                    )}
                  </div>
                  <div
                    className={`flex-1 overflow-hidden ${
                      chat.role === "user" ? "bg-gray-100" : "bg-[#EBF5FF]"
                    } rounded-lg p-3`}
                  >
                    {chat.role === "user" ? (
                      <p className="text-base text-gray-900 whitespace-pre-line">
                        {chat.content}
                      </p>
                    ) : (
                      <div className="prose prose-sm prose-blue max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="whitespace-pre-line">{children}</p>
                            ),
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
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
                          {normalizeText(chat.content)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#EBF5FF]">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex-1 bg-[#EBF5FF] rounded-lg p-3">
                <p className="text-base text-gray-900">Thinking...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-none gap-2 h-12 mt-5"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Chat with PM Assistant"
            className="flex-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-nonde focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
