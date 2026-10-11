import { useEffect, useState } from "react";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/blog", {
        params: {
          page,
          limit: 6,
          search,
          sort,
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
  }, [page, sort]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (page !== 1) {
      setPage(1);
      return;
    }

    getBlogs();
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

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

  return (
    <div>
      <h1>All Blogs</h1>

      <hr />

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>

        <select
          value={sort}
          onChange={handleSortChange}
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>
      </form>

      <hr />

      {loading && <p>Loading blogs...</p>}

      {error && (
        <div>
          <p>{error}</p>

          <button onClick={getBlogs}>
            Try Again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        blogs.length === 0 && (
          <p>
            {search
              ? `No blogs found for "${search}".`
              : "No blogs found."}
          </p>
        )}

      {!loading &&
        !error &&
        blogs.length > 0 && (
          <div>
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
              />
            ))}
          </div>
        )}

      {!loading &&
        !error &&
        blogs.length > 0 && (
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