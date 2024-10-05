import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../Service/helper.js";  // Add your backend URL here

const SummarizeEmail = () => {
  const [emailContent, setEmailContent] = useState(""); // To store the email content input
  const [summary, setSummary] = useState(""); // To store the summarized content
  const [loading, setLoading] = useState(false); // To show a loader during summarization

  // Function to handle the summarization request
  const handleSummarize = async () => {
    setLoading(true);  // Show loading while summarizing
    try {
      const response = await axios.post(`${BASE_URL}/summarize-email`, { emailContent });
      setSummary(response.data.summary || "No summary generated.");
    } catch (error) {
      console.error("Error summarizing email:", error);
      setSummary("An error occurred while summarizing.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="text-gray-600 body-font w-full">
      <div className="w-full p-1">
        <div className="border-2 border-gray-200 p-4 h-full rounded-2xl bg-stone-50 shadow-inner">
          <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 mb-2 text-center">
            Email Summarizer
          </h1>
          <div className="leading-relaxed p-4 md:p-8 font-medium text-center hover:text-gray-900 sm:text-xl text-base">
            {/* Textarea for Email Content */}
            <textarea
              rows="10"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Paste your email content here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
            
            <button
              onClick={handleSummarize}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Summarize Email
            </button>
            
            {/* Loading spinner */}
            {loading && <p>Summarizing...</p>}

            {/* Display Summarized Content */}
            {summary && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-semibold text-gray-900">Summary:</h3>
                <p className="text-gray-900 mt-2">{summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizeEmail;
