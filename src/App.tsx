import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import Layout from './components/Layout';
import Home from './pages/Home';
import StartHere from './pages/StartHere';
import RealQuestions from './pages/RealQuestions';
import DayInTheLife from './pages/DayInTheLife';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Resources from './pages/Resources';
import About from './pages/About';
import Newsletter from './pages/Newsletter';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminStartHere from './pages/admin/AdminStartHere';
import AdminVideos from './pages/admin/AdminVideos';
import AdminBlog from './pages/admin/AdminBlog';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/start-here" element={<StartHere />} />
            <Route path="/real-questions" element={<RealQuestions />} />
            <Route path="/day-in-the-life" element={<DayInTheLife />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminQuestions />} />
            <Route path="start-here" element={<AdminStartHere />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
