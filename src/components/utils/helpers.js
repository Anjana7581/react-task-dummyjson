export const formatUserData = (users) => {
  return users.map(user => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    company: user.company.name,
    address: `${user.address.city}, ${user.address.address}`,
    city: user.address.city
  }));
};

export const filterAndSortUsers = (users, { searchTerm, cityFilter, sortField, sortOrder }) => {
  let result = [...users];
  
  // Filtering
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(user => 
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.company.toLowerCase().includes(term))
  }
  
  if (cityFilter && cityFilter !== 'all') {
    result = result.filter(user => user.city === cityFilter);
  }
  
  // Sorting
  if (sortField) {
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return result;
};