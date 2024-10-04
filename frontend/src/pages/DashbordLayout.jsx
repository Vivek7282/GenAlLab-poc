import React from 'react';
import ChatPromt from "../componets/ChatPromt";
import Navbar  from '../componets/Navbar';
import Sidebar from '../componets/Sidebar';
import { useSelector } from "react-redux";
import {base_Url} from "../Service/helper.js";
const DashboardLayout = ({ children }) => {
  const { activeMenu } = useSelector((state) => state.dashboardContext);
  
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Setting button  */}
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <button
          type="button"
          style={{ background: "#03C9D7", borderRadius: "50%" }}
          className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
        >
         
        </button>
      </div>

      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static navbar w-full bg-slate-900 ">
          <Navbar />
        </div>

        <div>{children}</div>
       
      </div>
    </div>
  );
};

export default DashboardLayout;
