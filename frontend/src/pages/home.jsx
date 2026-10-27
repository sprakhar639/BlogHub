import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function getBlogs() {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/blog", { params: { page, limit: 9, search, sort } });
      setBlogs(data.blogs || []); setPagination(data.pagination);
    } catch (err) { setError(err.response?.data?.message || "Could not load stories. Check that the API and database are running."); }
    finally { setLoading(false); }
  }
  useEffect(() => { getBlogs(); }, [page, search, sort]);
  function submitSearch(event) { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }
  return <div className="page-wrap">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> A HOME FOR CURIOUS MINDS</div>
        <h1>Good ideas<br />deserve <em>to be read.</em></h1>
        <p className="hero-subtitle">Thoughtful stories from people figuring things out. Read something new, or share what you’ve learned.</p>
        <div className="hero-cta"><a href="#stories" className="button button-dark">Explore stories <span>↓</span></a>{user ? <Link to="/create" className="button button-soft">Write your own ↗</Link> : <Link to="/register" className="button button-soft">Join the community ↗</Link>}</div>
        <div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>Made for readers and makers</span></div>
      </div>
      <div className="hero-visual"><div className="visual-card visual-card-back"><span className="visual-small">IDEAS IN PROGRESS</span><div className="visual-squiggle">〰</div></div><div className="visual-card visual-card-front"><div className="visual-topline"><span className="visual-dot" /> THE DAILY NOTE</div><div className="visual-big">Make<br />space for<br /><i>curiosity.</i></div><div className="visual-footer"><span>WORDS THAT STICK</span><span>✳</span></div></div><span className="floating-star star-a">✳</span><span className="floating-star star-b">✴</span><span className="visual-caption">YOUR NEXT GOOD READ IS HERE ↗</span></div>
    </section>
    <section className="stories-section" id="stories"><div className="section-heading"><div><div className="eyebrow">THE READING ROOM</div><h2>Fresh from the community<span className="heading-period">.</span></h2><p>New perspectives, useful lessons, and stories worth your time.</p></div><span className="story-count">{pagination.totalBlogs ?? 0} STORIES</span></div>
      <div className="toolbar"><form className="search-form" onSubmit={submitSearch}><span className="search-icon">⌕</span><input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search stories, ideas, topics…" aria-label="Search stories" /><button type="submit">Search</button></form><label className="sort-select"><span>Sort by</span><select value={sort} onChange={e => { setPage(1); setSort(e.target.value); }}><option value="newest">Latest first</option><option value="oldest">Oldest first</option></select></label></div>
      {loading ? <Loading /> : error ? <ErrorMessage message={error} onRetry={getBlogs} /> : blogs.length ? <><div className="blog-grid">{blogs.map((blog, index) => <BlogCard key={blog._id} blog={blog} index={index} />)}</div><Pagination pagination={pagination} onPageChange={setPage} /></> : <div className="empty-state"><span>✳</span><h3>No stories found just yet.</h3><p>{search ? `Nothing matched “${search}”. Try another search.` : "Be the first to put an idea into the world."}</p>{user && <Link to="/create" className="button button-primary">Write the first story ↗</Link>}</div>}
    </section>
  </div>;
}
