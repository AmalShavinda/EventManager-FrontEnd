import {useState} from 'react'
import Sidebar from '../../components/Sidebar'
import Users from '../../components/User';
import Events from '../../components/Events';
import DeactiveUsers from '../../components/DeactiveUsers';


const AdminDash = () => {

  const [selectedPage, setSelectedPage] = useState('users');

    const renderContent = () => {
        switch (selectedPage) {
            case 'activeUsers':
                return <Users />;
            case 'deactiveUsers':
                return <DeactiveUsers />;
            case 'events':
                return <Events />;
            default:
                return <Users />;
        }
    };

  return (
    <div className="flex h-screen">
            <Sidebar setSelectedPage={setSelectedPage} />
            <div className="flex-1 p-6 bg-gray-100">
                {renderContent()}
            </div>
        </div>
  )
}

export default AdminDash
