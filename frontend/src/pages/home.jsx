import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Home() {
  const [blogs, setBlogs] = useState([]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/blog", {
        params: {
          page,
          limit: 6,
        },
      });

      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, [page]);

  const handlePrevious = () => {
    if (pagination.hasPreviousPage) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <div>
      <h1>All Blogs</h1>

      <div>
        <Link to="/MyProfile">
          <button>Profile</button>
        </Link>

        <Link to="/CreateBlog">
          <button>Create Blog</button>
        </Link>

        <button onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {loading && <p>Loading blogs...</p>}

      {error && (
        <div>
          <p>{error}</p>

          <button onClick={getBlogs}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <p>No blogs found.</p>
      )}

      {!loading &&
        !error &&
        blogs.map((blog) => (
          <div key={blog._id}>
            <Link to={`/blog/${blog._id}`}>
              <h2>{blog.title}</h2>
            </Link>

            <p>{blog.content}</p>
          </div>
        ))}

      {!loading && !error && blogs.length > 0 && (
        <div>
          <button
            onClick={handlePrevious}
            disabled={!pagination.hasPreviousPage}
          >
            ← Previous
          </button>

          <span>
            {" "}
            Page {pagination.currentPage} of{" "}
            {pagination.totalPages}{" "}
          </span>

          <button
            onClick={handleNext}
            disabled={!pagination.hasNextPage}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;