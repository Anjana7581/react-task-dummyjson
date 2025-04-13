import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UserTable from '../components/UserTable/UsersTable';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div >
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4  ">
          <UserTable/>
      </main>
    </div>
  );
};

export default Dashboard;