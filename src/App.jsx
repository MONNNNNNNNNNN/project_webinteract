import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { prefetchCareers, CAREER_INTERESTS } from "./lib/careersCache.js";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    ["", ...CAREER_INTERESTS].forEach((interest) => {
      prefetchCareers(interest);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 dark:bg-dme-navy dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Routes location={location}>
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
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
