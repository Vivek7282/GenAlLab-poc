import styles from "../style";
import HomePageLayout from "./DashbordLayout";
import React from 'react';
import ChatPromt from "../componets/ChatPromt";
import Navbar  from '../componets/Navbar';
import { useState, useEffect } from "react";
import Sidebar from '../componets/Sidebar';
import { useSelector } from "react-redux";
import axios from "axios";
import {BASE_URL} from "../Service/helper.js";
import { JAVA_BASE_URL } from "../Service/helper.js";



const App = () => {
    const [message, setMessage] = useState("");
    
   
      
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/message`);
          setMessage(response.data.message); 
        } catch (error) {
          console.error("Error occurred while fetching message: ", error);
        } 
      };
      
      fetchData();
    }, []);
  
    return (
      <HomePageLayout>
        <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <ChatPromt />
  
            {/* New div to display the message */}
            <div className="message-box" style={{ marginTop: '20px', color: 'black' }}>
              <h3>Message from Flask Backend:</h3>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </HomePageLayout>
    );
  };
  
  export default App;