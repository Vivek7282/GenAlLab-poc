import React, { useState } from 'react';
import axios from 'axios';
import {BASE_URL} from "../Service/helper.js";
function App() {
  // State to capture the user's input
  const [userMessage, setUserMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");


  // Function to handle sending the message to the backend
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(`${BASE_URL}/query`, { message: userMessage });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      
      <div className="text-gray-600 body-font w-full">
        <div className=" w-full p-1 ">
          <div className="border-2 border-gray-200 p-2 h-full rounded-2xl bg-stone-50  shadow-inner ">
            <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
              Welcome to GenAI Lab
            </h1>
            
            <div className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-gray-900 sm:text-xl text-base">
              {/* Input form */}
              <form onSubmit={sendMessage} className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Enter your message"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="p-2 border border-gray-300 rounded mb-4"
                />
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Send Message
                </button>
              </form>
              
              {/* Displaying response from backend */}
              {responseMessage && (
                <div className="mt-4 text-green-500">
                  <h3>Response from server:</h3>
                  <p>{responseMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
