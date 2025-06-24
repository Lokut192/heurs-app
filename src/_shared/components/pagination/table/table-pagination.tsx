'use client';

export type TablePaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  setPage: (page: number) => void;
};

function TablePagination({
  page,
  pageCount,
  pageSize: _pageSize,
  total: _total,
  setPage,
}: TablePaginationProps): React.ReactNode {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(pageCount, page + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
          pages.push('...');
        }
        pages.push(pageCount);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // const startItem = (page - 1) * pageSize + 1;
  // const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-row flex-wrap items-center gap-4">
      {/* <div className="text-sm text-gray-600">
        Display from {startItem} to {endItem} of {total} results
      </div> */}

      <div className="join">
        <button
          className={`join-item btn ${page === 1 ? 'btn-disabled' : ''}`}
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        >
          «
        </button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <button
                key={`ellipsis-${index}`}
                className="join-item btn btn-disabled"
              >
                ...
              </button>
            );
          }

          return (
            <button
              key={pageNum}
              className={`join-item btn ${page === pageNum ? 'btn-accent' : ''}`}
              onClick={() => setPage(Number(pageNum))}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className={`join-item btn ${page === pageCount ? 'btn-disabled' : ''}`}
          onClick={() => page < pageCount && setPage(page + 1)}
          disabled={page === pageCount}
        >
          »
        </button>
      </div>

      {/* <div className="flex items-center gap-2 text-sm">
        <span>Go to page:</span>
        <input
          type="number"
          min="1"
          max={pageCount}
          value={page}
          onChange={(e) => {
            const newPage = parseInt(e.target.value);
            if (newPage >= 1 && newPage <= pageCount) {
              setPage(newPage);
            }
          }}
          className="input input-bordered input-sm w-16 text-center"
        />
        <span>of {pageCount}</span>
      </div> */}
    </div>
  );
}

export default TablePagination as React.FC<TablePaginationProps>;
