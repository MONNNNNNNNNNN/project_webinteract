import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import Home from "./pages/Home.jsx";
import CurriculumRoadmap from "./pages/CurriculumRoadmap.jsx";
import TuitionFees from "./pages/TuitionFees.jsx";
import CareerExplorer from "./pages/CareerExplorer.jsx";
import StudentProjects from "./pages/StudentProjects.jsx";
import ThreeDWorld from "./pages/ThreeDWorld.jsx";
import AboutDME from "./pages/AboutDME.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-dme-navy text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curriculum" element={<CurriculumRoadmap />} />
          <Route path="/tuition" element={<TuitionFees />} />
          <Route path="/careers" element={<CareerExplorer />} />
          <Route path="/projects" element={<StudentProjects />} />
          <Route path="/3d-world" element={<ThreeDWorld />} />
          <Route path="/about" element={<AboutDME />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
