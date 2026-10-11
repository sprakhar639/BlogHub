import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/register";
import BlogDetails from "./pages/blogDetails";
import CreateBlog from "./pages/createBlog";
import EditBlog from "./pages/editBlog";
import MyProfile from "./pages/getMyProfile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/blog/:id"
            element={<BlogDetails />}
          />

          <Route
            path="/CreateBlog"
            element={<CreateBlog />}
          />

          <Route
            path="/EditBlog/:id"
            element={<EditBlog />}
          />

          <Route
            path="/MyProfile"
            element={<MyProfile />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;