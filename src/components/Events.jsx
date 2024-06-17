import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import axios from 'axios';

const Events = () => {
    const { data, loading, error, reFetch } = useFetch('http://localhost:8800/api/event/events');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ eventName: '', expectedDate: '', status: '' });
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8800/api/user/activeUsers');
                setActiveUsers(res.data);
            } catch (err) {
                console.error("Error fetching active users:", err);
            }
        };

        if (isAssignModalOpen) {
            fetchActiveUsers();
        }
    }, [isAssignModalOpen]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userIds = data.map(event => event.coordinator).filter(id => id);
            const uniqueUserIds = [...new Set(userIds)];
            const userDetailsPromises = uniqueUserIds.map(id => axios.get(`http://localhost:8800/api/user/user/${id}`));
            const userDetailsResponses = await Promise.all(userDetailsPromises);
            const userDetailsMap = {};
            userDetailsResponses.forEach(response => {
                userDetailsMap[response.data._id] = response.data.username;
            });
            setUserDetails(userDetailsMap);
        };

        if (data.length > 0) {
            fetchUserDetails();
        }
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleAddEvent = async () => {
        try {
            await axios.post('http://localhost:8800/api/event/create', newEvent);
            reFetch();
            setIsModalOpen(false);
            setNewEvent({ eventName: '', expectedDate: '', status: '' });
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/api/event/${id}`);
            reFetch();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleAssign = async () => {
        try {
            await axios.put(`http://localhost:8800/api/event/coordinator/${selectedEventId}`, { coordinator: selectedUser });
            reFetch();
            setIsAssignModalOpen(false);
        } catch (error) {
            console.error("Error assigning coordinator:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Events</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    New Event
                </button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Event Name</th>
                        <th className="py-2 px-4 border">Expected Date</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Coordinator</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(event => (
                        <tr key={event._id}>
                            <td className="border px-4 py-2">{event.eventName}</td>
                            <td className="border px-4 py-2">{event.expectedDate}</td>
                            <td className="border px-4 py-2">{event.status}</td>
                            <td className="border px-4 py-2">{userDetails[event.coordinator] || 'Unassigned'}</td>
                            <td className="border px-4 py-2 flex">
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedEventId(event._id);
                                        setIsAssignModalOpen(true);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
                                >
                                    Assign
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-12 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={newEvent.eventName}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Expected Date
                                </label>
                                <input
                                    type="date"
                                    name="expectedDate"
                                    value={newEvent.expectedDate}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={newEvent.status}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="Schedule">Schedule</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Add Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                            {error && <span>{error.message}</span>}
                        </form>
                    </div>
                </div>
            )}
            {isAssignModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-12 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Assign Event Coordinator</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAssign(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Select Coordinator
                                </label>
                                <select
                                    name="userId"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="shadow appearance-none border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="" disabled>Select a user</option>
                                    {activeUsers.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Assign
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
