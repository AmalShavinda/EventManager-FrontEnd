import {useState} from 'react'
import UserSidebar from '../../components/UserSidebar'
import AllEvents from '../../components/AllEvents';
import MyEvents from '../../components/MyEvents';

const UserDash = () => {
  const [selectedPage, setSelectedPage] = useState('events');

    const renderContent = () => {
        switch (selectedPage) {
            case 'myEvents':
                return <MyEvents />;
            case 'allEvents':
                return <AllEvents />;
            default:
                return <MyEvents />;
        }
    };

  return (
    <div className="flex h-screen">
            <UserSidebar setSelectedPage={setSelectedPage} />
            <div className="flex-1 p-6 bg-gray-100">
                {renderContent()}
            </div>
        </div>
  )
}

export default UserDash
