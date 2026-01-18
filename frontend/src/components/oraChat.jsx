import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateLLMResponse, generateLLMResponseCohere } from "../utils/chatUtils/chatapi.js";
import { formatResponse } from "../utils/chatUtils/chatFormater.jsx";
import {
  saveChat,
  getChats,
  getAllSessions,
} from "../utils/chatUtils/chatapi.js";

import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ArrowUp, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OraChat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const userId = "guest";
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("ora_session_id") || uuidv4()
  );
  const chatContainerRef = useRef(null);
 const [isCollapsed, setIsCollapsed] = useState(false);
 const navigate = useNavigate();
  // 🧭 Load current session chats
  useEffect(() => {
    (async () => {
      try {
        const data = await getChats(userId, sessionId);
        if (Array.isArray(data)) {
          const msgs = data.flatMap((msg) => [
            { role: "user", text: msg.message || msg.question || "" },
            { role: "bot", text: msg.response || msg.answer || "" },
          ]);
          setMessages(msgs);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("❌ Failed to load chats:", err);
      }
    })();
  }, [sessionId]);

  // 🧭 Auto-scroll on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 🗂️ Load all sessions
  useEffect(() => {
    (async () => {
      const allSessions = await getAllSessions(userId);
      setSessions(allSessions);
    })();
  }, []);

  // 🧭 Select a session
  const handleSessionSelect = (id) => {
    setSessionId(id);
    localStorage.setItem("ora_session_id", id);

    const selected = sessions.find((s) => s.session_id === id);
    if (selected?.chat_history) {
      const msgs = selected.chat_history.flatMap((m) => [
        { role: "user", text: m.message || m.question || "" },
        { role: "bot", text: m.response || m.answer || "" },
      ]);
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  };

  // 🆕 New session
  const handleNewSession = () => {
    const newSession = uuidv4();
    setSessionId(newSession);
    localStorage.setItem("ora_session_id", newSession);
    setMessages([]);
    console.log("🆕 Started new session:", newSession);
  };

  // 🧹 End + start fresh session
  const handleClear = async () => {
    try {
      const allSessions = await getAllSessions(userId);
      setSessions(allSessions);
      const newSession = uuidv4();
      setSessionId(newSession);
      localStorage.setItem("ora_session_id", newSession);
      setMessages([]);
      console.log("✅ Session ended, new session started:", newSession);
    } catch (err) {
      console.error("❌ Failed to end session:", err);
    }
  };

  // 💬 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const startTime = Date.now();
    setLoading(true);

    const userMessage = { role: "user", text: prompt.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt("");

    try {
      const contextWindow = 5;
      const contextMessages = newMessages.slice(-contextWindow * 2);
      const contextString = contextMessages
        .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
        .join("\n");

      const fullPrompt = `
You are Nova, a friendly and expressive AI assistant who is also an expert coder and explainer.

Guidelines:
- Maintain a warm, human tone with natural emotion.
- Use suitable emojis (😊, 💡, 🚀, 🤔, 🎯, 🧩) to add life, but keep responses professional when explaining code.
- When answering coding or technical questions:
  • Provide clear, well-commented examples.
  • Explain reasoning step-by-step.
  • Use best practices and mention edge cases if relevant.
- When chatting casually, keep it concise, warm, and engaging.
- Maintain continuity using the previous conversation context.

Here’s the previous context:
${contextString}

Now the user says: ${prompt.trim()}

Respond naturally, emotionally, and intelligently, adapting your tone based on whether it’s technical or conversational.
`;

      const llmResponse = await generateLLMResponseCohere(fullPrompt);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      const botMessage = { role: "bot", text: llmResponse };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      await saveChat(userId, sessionId, prompt.trim(), llmResponse);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = { role: "bot", text: "⚠️ Failed to get response." };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id) => {
  const confirmDelete = window.confirm("🗑️ Are you sure you want to delete this chat session?");
  if (!confirmDelete) return;

  try {
    const res = await fetch("http://localhost:5000/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, session_id: id }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("✅ Chat session deleted successfully!");
      setSessions((prev) => prev.filter((s) => s.session_id !== id));
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (err) {
    console.error("❌ Error deleting session:", err);
    alert("❌ Failed to delete session. Please try again.");
  }
};




  return (
  <div className="text-gray-600 bg-gray-800 body-font w-full flex h-screen">
    {/* Sidebar */}
    <div className="w-56 h-[99vh] bg-gray-900 mt-1 text-white p-1 rounded-xl flex flex-col shadow-inner ">
      <div className="mb-4">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition"
      >
        {/* Menu icon + title together */}
        <div className="flex items-center gap-2">
          <Menu size={18} className="text-white" />
          <span className="text-sm  font-semibold">OraChat</span>
        </div>

        {/* Chevron toggle icon */}
        {isCollapsed ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* Collapsible options */}
      {isCollapsed && (
        <div className="mt-2 flex flex-col space-y-1 pl-2 animate-fade-in">
          <button
            onClick={() => navigate("/chat")}
            className="text-left text-sm bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
          >
            OraChat
          </button>
          <button
            onClick={() => navigate("/ragChat")}
            className="text-left text-sm bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
          >
            OraRagChat
          </button>
          <button
            onClick={() => navigate("/kb")}
            className="text-left text-sm bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
          >
            Knowledge Base
          </button>
          <button
                onClick={() => navigate("/askkb")}
                className="text-left text-sm bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
              >
                Ask KB
              </button>
              <button
                onClick={() => navigate("/mcp")}
                className="text-left text-sm bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
              >
                MCP
              </button>
        </div>
      )}
    </div>

      <h2 className="text-sm mb-4 text-center  pb-2">
        💬 Chats History
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
  {sessions.length === 0 ? (
    <p className="text-gray-400 text-sm text-center">No sessions yet</p>
  ) : (
    sessions.map((s, idx) => (
      <div
        key={s.session_id}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
          s.session_id === sessionId
            ? "bg-teal-600 text-white"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        {/* Session details */}
        <button
          onClick={() => handleSessionSelect(s.session_id)}
          className="flex flex-col flex-1 text-left"
        >
          <span className="font-semibold">Session {idx + 1}</span>
          <span className="text-gray-300 text-xs truncate">
            {s.last_message
              ? s.last_message.slice(0, 10) + (s.last_message.length > 10 ? "..." : "")
              : "No messages yet"}
          </span>
        </button>

        {/* 🗑️ Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering session select
            handleDeleteSession(s.session_id);
          }}
          className="ml-2 text-red-400 hover:text-red-600 transition"
          title="Delete chat session"
        >
          🗑️
        </button>
      </div>
    ))
  )}
</div>


      <button
        onClick={handleNewSession}
        className="mt-4 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 "
      >
         New Chat
      </button>
    </div>

    {/* Main Chat Area */}
    <div className="h-[100vh] flex-1 w-full p-1 mt-0 rounded-xl">
      <div className=" p-2 h-full rounded-2xl bg-gray-800 shadow-inner">
        {messages.length === 0 ? (
          // Updated Welcome Screen (Styled like RAG, but no KB)
          <div className="text-center space-y-6 flex flex-col items-center justify-center h-full">
            <h1 className="md:text-3xl text-2xl font-medium text-gray-100 italic">
              Welcome to OraChat
            </h1>
            <p className="text-gray-300 text-sm mb-4">
              Your local LLaMA model is ready to chat.
            </p>

            {/* Input area */}
            <div className="w-full max-w-lg  mt-10">
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-0  rounded-2xl bg-gray-800 p-3 shadow-sm hover:shadow-md transition-all border border-gray-700"
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="flex-1 min-h-[70px] max-h-[70px] p-3 rounded-xl border-none resize-none focus:outline-none text-gray-100 bg-gray-800 placeholder-gray-400"
                  placeholder="Message OraChat..."
                  rows={3}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 mb-1 rounded-xl text-white font-medium transition-colors duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  }`}
                  disabled={loading}
                >
                  {loading ? "..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <button
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                End Session
              </button>
            </div>

            {/* Chat Container */}
            <div
              ref={chatContainerRef}
              className="h-[80vh] mt-[-10px] overflow-y-auto font-size-0.75rem text-sm bg-gray-800 text-gray-100 p-4 rounded-lg space-y-3  flex flex-col"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm md:text-sm leading-relaxed break-words shadow-sm max-w-[70%] whitespace-pre-wrap
                      ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white rounded-br-none mr-2"
                          : "bg-gray-700 text-gray-100 rounded-bl-none ml-[10%]"
                      }`}
                  >
                    {msg.role === "bot"
                      ? formatResponse(msg.text)
                      : msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSubmit}
              className="mt-2 flex items-center border border-gray-700 rounded-lg bg-gray-800 focus-within:ring-2 focus-within:ring-teal-400 rounded-4xl "
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="flex-1 p-2 bg-transparent text-white resize-none border border-gray-700 focus:outline-none placeholder-gray-400 "
                rows={1}
                placeholder="Ask something..."
                disabled={loading}
              />
              <button
                type="submit"
                className={`ml-2 mr-4 p-2 rounded-full flex items-center justify-center transition-colors duration-300 shadow-md
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="text-white text-sm">...</span>
                ) : (
                  <ArrowUp size={18} className="text-white" />
                )}
              </button>
            </form>

            {responseTime && (
              <p className="text-sm text-gray-100 mt-1 text-center">
                ⏱️ Response Time: {(responseTime / 1000).toFixed(2)} sec
              </p>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
}
export default OraChat;
