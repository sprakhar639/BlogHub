import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";

export default function EditBlog() {
  const { id } = useParams(); const navigate = useNavigate();
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; api.get(`/blog/${id}`).then(({ data }) => { if (active) { setTitle(data.blog.title); setContent(data.blog.content); } }).catch(err => { if (active) setError(err.response?.data?.message || "Could not load story."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  async function handleUpdate(event) { event.preventDefault(); setSaving(true); setError(""); try { await api.put(`/blog/${id}`, { title, content }); navigate(`/blog/${id}`); } catch (err) { setError(err.response?.data?.message || "Could not save changes."); } finally { setSaving(false); } }
  if (loading) return <Loading label="Opening your draft" />;
  return <div className="editor-page"><div className="editor-top"><Link to={`/blog/${id}`} className="back-link">← Back to story</Link><span className="draft-label"><span /> EDITING STORY</span></div><div className="editor-intro"><div className="eyebrow">MAKE IT EVEN BETTER</div><h1>Refine the<br /><em>story.</em></h1><p>Make your changes, then save when you’re ready.</p></div><form className="editor-form" onSubmit={handleUpdate}>{error && <div className="form-error">{error}</div>}<label className="editor-title-label">Story title<input className="editor-title" value={title} onChange={e => setTitle(e.target.value)} minLength="5" maxLength="200" required /></label><div className="editor-meta"><span>YOUR STORY</span><span>{content.trim() ? content.trim().split(/\s+/).length : 0} WORDS</span></div><textarea className="editor-content" value={content} onChange={e => setContent(e.target.value)} minLength="10" required /><div className="editor-actions"><span>Only you can edit this story.</span><button className="button button-primary" disabled={saving}>{saving ? "Saving…" : "Save changes ↗"}</button></div></form></div>;
}
