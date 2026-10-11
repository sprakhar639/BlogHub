import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to logout"
      );
    }
  };

  return (
    <nav>
      <div>
        <Link to="/">
          <h2>BlogSpace</h2>
        </Link>
      </div>

      <div>
        <Link to="/">
          Home
        </Link>

        {" | "}

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
      </div>
    </nav>
  );
}

export default Navbar;