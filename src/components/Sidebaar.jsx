import React from "react";

const Sidebar = ({ onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4 text-2xl font-bold">Dashboard</div>
      <ul>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">
          <a href="/students">Students Page</a>
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
