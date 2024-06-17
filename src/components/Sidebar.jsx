import React from 'react';

const Sidebar = ({ setSelectedPage }) => {
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-xl font-bold">Admin Dashboard</div>
            <button
                onClick={() => setSelectedPage('activeUsers')}
                className="p-4 text-left hover:bg-gray-700 focus:outline-none"
            >
                Active Users
            </button>
            <button
                onClick={() => setSelectedPage('deactiveUsers')}
                className="p-4 text-left hover:bg-gray-700 focus:outline-none"
            >
                Deactive Users
            </button>
            <button
                onClick={() => setSelectedPage('events')}
                className="p-4 text-left hover:bg-gray-700 focus:outline-none"
            >
                Events
            </button>
        </div>
    );
};

export default Sidebar;
