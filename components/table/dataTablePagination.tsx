import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  dataLength: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DataTablePagination: React.FC<Props> = ({
  dataLength,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(dataLength / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, dataLength);

  // Calculer les pages à afficher
  const pageNumbers = [];
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(maxVisiblePages, totalPages);
    } else {
      startPage = Math.max(1, endPage - (maxVisiblePages - 1));
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-4 px-4">
      <div className="text-sm text-foreground">
        Affichage {startIndex} à {Math.min(endIndex, dataLength)} sur{" "}
        {dataLength} entrées
      </div>
      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-2 py-1 rounded bg-bg-secondary text-foreground hover:bg-primary/10"
            >
              1
            </button>
            {startPage > 2 && <span className="text-foreground">...</span>}
          </>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => {
              if (currentPage !== page) onPageChange(page);
            }}
            className={`px-2 py-1 rounded ${
              currentPage === page
                ? "bg-primary/60 text-white"
                : "bg-bg-secondary text-foreground hover:bg-primary/10"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-foreground">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-2 py-1 rounded bg-bg-secondary text-foreground hover:bg-primary/10"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-bg-secondary disabled:opacity-50"
        >
          <FiChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm text-foreground">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-bg-secondary disabled:opacity-50"
        >
          <FiChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default DataTablePagination;
