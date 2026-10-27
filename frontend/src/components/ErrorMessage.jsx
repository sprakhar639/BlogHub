export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="notice notice-error">
      <span className="notice-icon">!</span>
      <div>
        <strong>That didn’t work</strong>
        <p>{message || "Something went wrong. Please try again."}</p>
        {onRetry && (
          <button className="text-button" onClick={onRetry}>
            Try again ↗
          </button>
        )}
      </div>
    </div>
  );
}
