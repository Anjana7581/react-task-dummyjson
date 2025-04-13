const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Always show first, last, current, and adjacent pages
  const getPages = () => {
    const pages = [];
    const maxVisible = 3; // Max pages to show besides first/last
    
    // Always show first page
    pages.push(1);
    
    // Show ellipsis if gap between first and current-1
    if (currentPage - 1 > 2) {
      pages.push('...');
    }
    
    // Show current page and adjacent pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Show ellipsis if gap between current+1 and last
    if (currentPage + 1 < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if different from first
    if (totalPages !== 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-3 gap-1 sm:gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 min-w-[5rem] sm:min-w-[6rem] rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="Previous page"
      >
        ← Prev
      </button>
      
      {/* Page Numbers - Hidden on smallest screens */}
      <div className="hidden xs:flex items-center gap-1 flex-wrap justify-center">
        {getPages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 min-w-[2rem] rounded flex items-center justify-center text-sm ${
                currentPage === page
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'border hover:bg-gray-50'
              } transition-colors`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      {/* Current Page Indicator - Only on smallest screens */}
      <div className="xs:hidden text-sm font-medium px-2">
        {currentPage}/{totalPages}
      </div>
      
      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 min-w-[5rem] sm:min-w-[6rem] rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;