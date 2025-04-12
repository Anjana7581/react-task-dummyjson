export const getUsers = async () => {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  };