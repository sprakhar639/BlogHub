export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  return <div className="pagination"><button className="button button-outline" disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.currentPage - 1)}>← Previous</button><span>Page <strong>{pagination.currentPage}</strong> of {pagination.totalPages}</span><button className="button button-outline" disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.currentPage + 1)}>Next →</button></div>;
}
