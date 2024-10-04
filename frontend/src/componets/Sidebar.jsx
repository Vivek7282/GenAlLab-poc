import React, { useState } from 'react';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
      <div className="py-4 px-6 bg-gray-900 text-center">
        <h2 className="text-xl font-semibold">Your App</h2>
      </div>

      <div className="flex-grow">
        <ul className="mt-4">
          <li
            className={`px-6 py-3 cursor-pointer hover:bg-gray-700 ${
              activeTab === 'Home' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabClick('Home')}
          >
            Home
          </li>
          <li
            className={`px-6 py-3 cursor-pointer hover:bg-gray-700 ${
              activeTab === 'Projects' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabClick('Projects')}
          >
            Projects
          </li>
          <li
            className={`px-6 py-3 cursor-pointer hover:bg-gray-700 ${
              activeTab === 'Settings' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabClick('Settings')}
          >
            Settings
          </li>
        </ul>
      </div>

      <div className="py-4 px-6 bg-gray-900">
        <button className="w-full bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 transition duration-200">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
