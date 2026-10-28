import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { data } = await api.post("/blog", { title, content });
      navigate(`/blog/${data.blog._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish your story.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="editor-page">
      <div className="editor-top">
        <Link to="/" className="back-link">
          ← Back to stories
        </Link>
        <span className="draft-label">
          <span /> NEW STORY
        </span>
      </div>
      <div className="editor-intro">
        <div className="eyebrow">YOUR TURN TO SHARE</div>
        <h1>
          Put your idea
          <br />
          <em>into words.</em>
        </h1>
        <p>Don’t worry about perfect. Start with something true.</p>
      </div>
      <form className="editor-form" onSubmit={handleCreate}>
        {error && <div className="form-error">{error}</div>}
        <label className="editor-title-label">
          Story title
          <input
            className="editor-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength="5"
            maxLength="200"
            placeholder="A title that makes someone curious…"
            required
          />
        </label>
        <div className="editor-meta">
          <span>YOUR STORY</span>
          <span>
            {content.trim() ? content.trim().split(/\s+/).length : 0} WORDS
          </span>
        </div>
        <textarea
          className="editor-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minLength="10"
          placeholder="What have you been thinking about lately? Start writing here…"
          required
        />
        <div className="editor-actions">
          <span>Your story will be published for everyone to read.</span>
          <button className="button button-primary" disabled={saving}>
            {saving ? "Publishing…" : "Publish story ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
