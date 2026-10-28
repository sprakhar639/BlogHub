import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/auth-context";



export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        const { data } = await api.get("/blog", {
          params: { page, limit: 9, search, sort },
        });
        if (!cancelled) {
          setBlogs(data.blogs || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalBlogs: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          });
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load stories. Check that the API and database are running.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBlogs();
    return () => { cancelled = true; };
  }, [page, search, sort, retryCount]);

  function submitSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

 
  return (
    <main className="page-wrap glass-home">
      <div className="glass-background-dots" aria-hidden="true" />
      <section className="hero glass-hero">
        <div className="hero-copy glass-hero-copy">
          <div className="glass-hero-kicker"><span /> A HOME FOR CURIOUS MINDS</div>
          <h1>Share ideas<br />that <em>matter.</em></h1>
          <p className="hero-subtitle">
            Discover insightful stories, technical deep dives, and<br className="desktop-break" /> fresh perspectives from developers around the world.
          </p>

          <form className="search-form hero-search glass-search" onSubmit={submitSearch}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              value={searchInput}
              onChange={(event) => {
                const value = event.target.value;
                setSearchInput(value);
                setPage(1);
                setSearch(value.trim());
              }}
              placeholder="Search stories, ideas, topics..."
              aria-label="Search stories"
            />
            <button type="submit">Search</button>
          </form>

        
        </div>

        <div className="hero-visual glass-hero-visual" aria-label="Share your knowledge with the world">
          <div className="glass-orb glass-orb-a" />
          <div className="glass-orb glass-orb-b" />
          <div className="glass-orb glass-orb-c" />
          <div className="write-story-glass-card">
            <div className="write-story-inner">
              <div className="write-story-icon" aria-hidden="true">↗</div>
              <h2>Write<br />Your Story</h2>
              <p>Share your knowledge<br />with the world</p>
            </div>
            <Link
              to={user ? "/create" : "/register"}
              className="write-story-arrow"
              aria-label={user ? "Write a story" : "Join BlogHub"}
            >
              ›
            </Link>
          </div>
        </div>
      </section>

      <section className="stories-section glass-stories" id="stories">
        <div className="section-heading glass-section-heading">
          <div>
            <div className="glass-section-kicker">LATEST</div>
            <h2>Latest Stories</h2>
          </div>
          <label className="sort-select glass-sort-select">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => { setPage(1); setSort(event.target.value); }}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => {
            setLoading(true);
            setRetryCount((count) => count + 1);
          }} />
        ) : blogs.length > 0 ? (
          <>
            <div className="blog-grid glass-blog-grid">
              {blogs.map((blog, index) => <BlogCard key={blog._id} blog={blog} index={index} />)}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        ) : (
          <div className="empty-state glass-empty-state">
            <span>✳</span>
            <h3>No stories found just yet.</h3>
            <p>{search ? `Nothing matched “${search}”. Try another search.` : "Be the first to put an idea into the world."}</p>
            {user && <Link to="/create" className="button button-primary">Write the first story ↗</Link>}
          </div>
        )}
      </section>
    </main>
  );
}
