const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <div className="flex justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-3 py-2 rounded border border-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 py-2">...</span>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
        const pageNum = startPage + idx;
        return (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-2 rounded ${
              currentPage === pageNum
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 py-2">...</span>}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-2 rounded border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;