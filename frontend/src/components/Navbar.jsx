import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to logout"
      );
    }
  };

  if (loading) {
    return (
      <nav>
        <Link to="/">
          <h2>BlogSpace</h2>
        </Link>
      </nav>
    );
  }

  return (
    <nav>
      <div>
        <Link to="/">
          <h2>BlogSpace</h2>
        </Link>
      </div>

      <div>
        <Link to="/">Home</Link>

        {" | "}

        {user ? (
          <>
            <Link to="/CreateBlog">
              Create Blog
            </Link>

            {" | "}

            <Link to="/MyProfile">
              Profile
            </Link>

            {" | "}

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            {" | "}

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;