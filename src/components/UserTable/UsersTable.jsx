import { useState, useEffect } from 'react';
import { getUsers } from '../../api/dummyJsonApi';
import Loader from './Loader';
import ErrorMessage from '../ErrorMessage';
import Pagination from './Pagination';
import SearchFilter from './SearchFilter';
import { formatUserData, filterAndSortUsers } from '../utils/helpers';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    cityFilter: 'all',
    sortField: '',
    sortOrder: 'asc'
  });
  
  const usersPerPage = 5;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        const formatted = formatUserData(data.users);
        setUsers(formatted);
        setFilteredUsers(formatted);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = filterAndSortUsers(users, filters);
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, filters]);

  // Get unique cities for filter dropdown
  const cities = ['all', ...new Set(users.map(user => user.city))].filter(Boolean);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader />
    </div>
  );
  
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="py-6 border-b border-gray-100 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">View and manage all registered users</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <SearchFilter 
          filters={filters} 
          setFilters={setFilters} 
          cities={cities} 
        />
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon sorted={filters.sortField === 'fullName'} direction={filters.sortOrder} />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon sorted={filters.sortField === 'email'} direction={filters.sortOrder} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center">
                    Company
                    <SortIcon sorted={filters.sortField === 'company'} direction={filters.sortOrder} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.address}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
            <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
            <span className="font-medium">{filteredUsers.length}</span> users
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

const SortIcon = ({ sorted, direction }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`ml-1 h-4 w-4 ${sorted ? 'text-gray-700' : 'text-gray-400'}`} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    {!sorted || direction === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    )}
  </svg>
);

export default UsersTable;