import { Link } from "react-router-dom";
const palettes = ["mint", "lavender", "peach", "blue"];
function formatDate(date) { return date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently"; }
function excerpt(text = "", max = 160) { return text.length > max ? `${text.slice(0, max).trim()}…` : text; }
export default function BlogCard({ blog, index = 0 }) {
  const palette = palettes[index % palettes.length];
  return <article className="blog-card" style={{ "--delay": `${index * 65}ms` }}>
    <Link to={`/blog/${blog._id}`} className={`card-art art-${palette}`} aria-label={`Read ${blog.title}`}>
      <span className="art-orb orb-one" /><span className="art-orb orb-two" />
      <span className="art-label">FIELD NOTES&nbsp; / &nbsp;{String(index + 1).padStart(2, "0")}</span>
      <span className="art-glyph">{["✳", "◒", "✺", "⌘"][index % 4]}</span>
    </Link>
    <div className="card-body"><div className="card-meta"><span>{blog.author?.username || "Guest writer"}</span><i />{formatDate(blog.createdAt)}</div>
      <h2><Link to={`/blog/${blog._id}`}>{blog.title}</Link></h2>
      <p>{excerpt(blog.content)}</p>
      <div className="card-bottom"><span className="read-time">{Math.max(1, Math.ceil((blog.content || "").split(/\s+/).length / 220))} min read</span><Link className="read-link" to={`/blog/${blog._id}`}>Read story <span>↗</span></Link></div>
    </div>
  </article>;
}
