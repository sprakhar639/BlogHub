import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="not-found">
      <span>404 / LOST IN THE MARGINS</span>
      <h1>
        This page took
        <br />
        <em>a different turn.</em>
      </h1>
      <p>The page you’re looking for doesn’t exist, or it may have moved.</p>
      <Link className="button button-dark" to="/">
        Back to the reading room ↗
      </Link>
    </div>
  );
}
