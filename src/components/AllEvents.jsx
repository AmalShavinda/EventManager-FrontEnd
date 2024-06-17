import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AllEvents = () => {
    const { data, loading, error } = useFetch('http://localhost:8800/api/event/events');
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">All Events</h2>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Event Name</th>
                        <th className="py-2 px-4 border">Expected Date</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Coordinator</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(event => (
                        <tr key={event._id}>
                            <td className="border px-4 py-2">{event.eventName}</td>
                            <td className="border px-4 py-2">{event.expectedDate}</td>
                            <td className="border px-4 py-2">{event.status}</td>
                            <td className="border px-4 py-2">{userDetails[event.coordinator] || 'Unassigned'}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllEvents;
