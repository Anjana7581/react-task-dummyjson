const SearchFilter = ({ filters, setFilters, cities }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="p-4 flex flex-col sm:flex-row gap-4 border-b">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search..."
          value={filters.searchTerm}
          onChange={handleChange}
          className="flex-grow px-3 py-2 border rounded"
        />
        
        <select
          name="cityFilter"
          value={filters.cityFilter}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SearchFilter;