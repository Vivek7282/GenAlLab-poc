import React from 'react';


import { useState, useEffect } from "react";
import Sidebar from '../componets/Sidebar';
import { useSelector } from "react-redux";
import axios from "axios";
import {JAVA_BASE_URL, BASE_URL} from "../Service/helper.js";
const DashboardLayout = ({ children }) => {
  const { activeMenu } = useSelector((state) => state.dashboardContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/message`);
        setMessage(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      } 
    };
    fetchData();
  }, []);
  return (
    <div className="">
        <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
