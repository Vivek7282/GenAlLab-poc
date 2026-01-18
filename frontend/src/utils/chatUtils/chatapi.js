
import axios from "axios";
export const generateLLMResponse = async (message) => {
  try {
     const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:latest",
          prompt: message,
          stream: false,
        }),
      });
    if (!response.ok) {
      throw new Error("Failed to get LLM response");
    }
    const data = await response.json();
    const llmResponse =
      typeof data === "string"
        ? data
        : data.response || data.output || "No response";

    return llmResponse;
  } catch (err) {
    console.error("Error while generating LLM response:", err);
    throw err;
  }
};

export const generateLLMResponseCohere = async (message) => {
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract text safely
    const llmResponse =
      response?.message?.content?.[0]?.text ||
      "No response from Cohere";

    return llmResponse;
  } catch (err) {
    console.error("Error while generating LLM response:", err);
    throw err;
  }
};
// export const generateLLMResponse = async (message) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });

//     if (!response.ok) throw new Error("Failed to get LLM response");

//     const data = await response.json();
//     return data.response;
//   } catch (err) {
//     console.error("Error while generating LLM response:", err);
//     throw err;
//   }
// };



// const API_BASE = "http://localhost:5000/api/chat"; // adjust if deployed

// // Save message + response
// export const saveChat = async (user, message, response) => {
//   await fetch(`${API_BASE}/save`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user, message, response }),
//   });
// };

// // Get chats for a session/user
// export const getChats = async (user) => {
//   const res = await fetch(`${API_BASE}/${user}`);
//   return res.json();
// };

// // Clear all chats
// export const clearChats = async (user) => {
//   await fetch(`${API_BASE}/clear/${user}`, { method: "DELETE" });
// };


// src/utils/chatUtils/chatapi.js
import { CohereClientV2 } from "cohere-ai";

// Initialize Cohere client
const cohere = new CohereClientV2({
  token: 'Y9yCkVlUkr2xZvRYrI5wwIj1CmWHWocax435rzWi',
});
 
const API_BASE = "http://localhost:5000/api/chat";

export const saveChat = async (user, session_id, message, response) => {
  try {
    await axios.post("http://localhost:5000/api/chat/save", {
      user,
      session_id,
      message,
      response,
    });
  } catch (err) {
    console.error("❌ Failed to save chat:", err);
  }
};


export const getChats = async (user, session_id) => {
  const res = await axios.get(`${API_BASE}/${user}/${session_id}`);
  return res.data;
};

export const endSession = async (user, session_id) => {
  const res = await axios.post(`${API_BASE}/end/${user}/${session_id}`);
  return res.data;
};

// 🗂️ Get all sessions for a user (chat history list)
export const getAllSessions = async (userId) => {
  const res = await axios.get(`${API_BASE}/sessions/${userId}`);
  return res.data;
};

export const getAllRagSessions = async (userId) => {
  const res = await axios.get(`${API_BASE}/ragSessions/${userId}`);
//   console.log("📂 Fetched RAG sessions:", res.data);
  return res.data;
};

export const getRagChats = async (user, session_id) => {
  const res = await axios.get(`${API_BASE}/ragChat/${user}/${session_id}`);
  return res.data;
};
export const saveRagChat = async (user, session_id, message, response, citations = []) => {
  try {
    const res = await fetch("http://localhost:5000/api/ragchat/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        session_id,
        message,
        response,
        citations, // ✅ new field
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("❌ Error saving RAG chat:", err);
  }
};


export const endRagSession = async (user, session_id) => {
  const res = await axios.post(`${API_BASE}/end/${user}/${session_id}`);
  return res.data;
};


export const deleteRagSession = async (user, session_id) => {
  const res = await axios.delete(`${API_BASE}/ragchat/delete/${user}/${session_id}`);
  return res.data;
};
