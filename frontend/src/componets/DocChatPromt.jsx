import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../Service/helper.js";

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setDocumentText(res.data.text); // Assume the server returns the extracted text
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleQuery = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/docQuery`, { query, documentText });
      setResponse(res.data[0]); // Handle response from the Rerank API
      console.log(res.data[0]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="text-gray-600 body-font w-full">
      <div className="w-full p-1">
        <div className="border-2 border-gray-200 p-2 h-full rounded-2xl bg-stone-50 shadow-inner">
          <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic">
            Upload and Query a Document
          </h1>
          <div className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-gray-900 sm:text-xl text-base">
            
            {/* File Upload */}
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleUpload}
              className="bg-teal-500 text-white px-4 ml-10 py-2 rounded hover:bg-teal-600"
            >
              Upload Document
            </button>

            {/* Display Document Text */}
            {documentText && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-semibold text-gray-900">Extracted Document Text:</h3>
                <p className="text-gray-900 mt-2">{documentText}</p>
              </div>
            )}

            {/* Query Input */}
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Ask a question about the document"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded mb-4 mt-4"
            />
            </div>
            <button
              onClick={handleQuery}
              className="bg-teal-500 text-white px-4 mt-10 py-2 rounded hover:bg-teal-600"
            >
              Submit Question
            </button>

            {/* Display Rerank Response */}
            {response && (
  <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
    <h3 className="font-semibold text-gray-900">Response from Server:</h3>
    <p className="text-gray-900 mt-2">Document: {response.document}</p>
    <p className="text-gray-900 mt-2">Score: {response.score}</p>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
