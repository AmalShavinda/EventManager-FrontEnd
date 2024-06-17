import { useContext, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const MyEvents = () => {
    const { user } = useContext(AuthContext);
    const userId = user._id;
    const { data, loading, error, reFetch } = useFetch(`http://localhost:8800/api/event/myEvents/${userId}`);
    const [statusUpdates, setStatusUpdates] = useState({});
    const [userDetails, setUserDetails] = useState({})

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

    const handleChange = (eventId, newStatus) => {
        setStatusUpdates(prev => ({ ...prev, [eventId]: newStatus }));
    };

    const handleUpdate = async (eventId) => {
        try {
            const newStatus = statusUpdates[eventId];
            if (newStatus) {
                await axios.put(`http://localhost:8800/api/event/status/${eventId}`, { status: newStatus });
                reFetch(); // Re-fetch events to get the updated data
            }
        } catch (error) {
            console.error("Error updating event status:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">My Assigned Events</h2>
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
                            <td className="border px-4 py-2 flex gap-2">
                                <select
                                    name="status"
                                    value={statusUpdates[event._id] || event.status}
                                    onChange={(e) => handleChange(event._id, e.target.value)}
                                    className="shadow appearance-none border rounded w-[150px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                                <button
                                    onClick={() => handleUpdate(event._id)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyEvents;
