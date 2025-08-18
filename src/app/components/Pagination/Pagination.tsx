import s from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => (
  <div className={s.pagination}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
      className={s.button}
    >
      ← Previous
    </button>

    <span className={s.page}>
      {currentPage} из {totalPages}
    </span>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      className={s.button}
    >
      Next →
    </button>
  </div>
);

export default Pagination;
