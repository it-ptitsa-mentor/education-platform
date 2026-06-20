type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const pageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
};

export const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  if (totalItems === 0) {
    return null;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const numbers = pageNumbers(page, totalPages);

  return (
    <nav className="pagination" aria-label="Навигация по страницам">
      <p className="pagination-meta">
        {from}–{to} из {totalItems}
      </p>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Предыдущая страница"
        >
          ←
        </button>

        {numbers.map((value, index) => {
          const prev = numbers[index - 1];
          const showEllipsis = prev !== undefined && value - prev > 1;

          return (
            <span key={value} className="pagination-number-wrap">
              {showEllipsis && <span className="pagination-ellipsis">…</span>}
              <button
                type="button"
                className={`pagination-btn${value === page ? " is-active" : ""}`}
                onClick={() => onPageChange(value)}
                aria-current={value === page ? "page" : undefined}
              >
                {value}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Следующая страница"
        >
          →
        </button>
      </div>
    </nav>
  );
};
