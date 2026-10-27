import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/register";
import BlogDetails from "./pages/blogDetails";
import CreateBlog from "./pages/createBlog";
import EditBlog from "./pages/editBlog";
import MyProfile from "./pages/getMyProfile";
import NotFound from "./pages/NotFound";

export default function App() {
  return <AuthProvider><BrowserRouter><Navbar /><main className="site-main"><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/blog/:id" element={<BlogDetails />} />
    <Route path="/create" element={<CreateBlog />} />
    <Route path="/edit/:id" element={<EditBlog />} />
    <Route path="/profile" element={<MyProfile />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><footer className="site-footer"><span>BlogHub © {new Date().getFullYear()}</span><span>Ideas are better when shared.</span></footer></BrowserRouter></AuthProvider>;
}
