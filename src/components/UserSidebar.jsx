import React from 'react';

const UserSidebar = ({ setSelectedPage }) => {
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-xl font-bold">User Dashboard</div>
            <button
                onClick={() => setSelectedPage('myEvents')}
                className="p-4 text-left hover:bg-gray-700 focus:outline-none"
            >
                My Events
            </button>
            <button
                onClick={() => setSelectedPage('allEvents')}
                className="p-4 text-left hover:bg-gray-700 focus:outline-none"
            >
                All Events
            </button>
        </div>
    );
};

export default UserSidebar;
