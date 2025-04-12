import Navbar from './components/Navbar';
import UsersTable from './components/UserTable/UsersTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar/>
    <main className="max-w-7xl mx-auto px-4 py-6">
      <UsersTable />
    </main>
  </div>
  );
}

export default App;