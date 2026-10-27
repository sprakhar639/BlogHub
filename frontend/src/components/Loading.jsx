export default function Loading({ label = "Finding good stories" }) {
  return <div className="loading-state" role="status"><span className="loader" /><p>{label}<span className="loading-dots">...</span></p></div>;
}
