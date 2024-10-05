import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../Service/helper.js";

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStreamMessage, setResponseStreamMessage] = useState("");

  // Function to handle non-streamed message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(
        `${BASE_URL}/query`,
        { message: userMessage },
        { headers: { "Content-Type": "application/json" } }
      );
      
      setResponseMessage(response.data.response || "No response from server");
      console.log(response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to handle streamed message
  const sendStreamMessage = async (e) => {
    e.preventDefault();  // Prevent page reload
    setResponseStreamMessage("");  // Clear previous response

    try {
        // Step 1: Send the user message to the backend via POST
        await axios.post(`${BASE_URL}/send-stream`, { message: userMessage }, {
            headers: { "Content-Type": "application/json" }
        });

        // Step 2: Now listen to the event stream with GET
        const eventSource = new EventSource(`${BASE_URL}/stream-chat`);

        eventSource.onmessage = (event) => {
            setResponseStreamMessage((prevMessage) => prevMessage + event.data);
        };

        eventSource.onerror = (error) => {
            console.error("Error with EventSource", error);
            eventSource.close();  // Close the stream in case of an error
        };
    } catch (error) {
        console.error("Error sending message:", error);
    }
};


  return (
    <div className="text-gray-600 body-font w-full">
      <div className="w-full p-1">
        <div className="border-2 border-gray-200 p-2 h-full rounded-2xl bg-stone-50 shadow-inner">
          <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic">
            Welcome to GenAI Lab
          </h1>
          <div className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-gray-900 sm:text-xl text-base">
            {/* Input form */}
            <input
              type="text"
              placeholder="Message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={sendMessage}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Send Non-Streamed Message
              </button>
              <button
                onClick={sendStreamMessage}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Send Streamed Message
              </button>
            </div>

            {/* Displaying response from backend */}
            {responseMessage && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-semibold text-gray-900">Response from server:</h3>
                <p className="text-gray-900 mt-2">{responseMessage}</p>
              </div>
            )}

            {responseStreamMessage && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-semibold text-gray-900">Stream response from server:</h3>
                <p>{responseStreamMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
