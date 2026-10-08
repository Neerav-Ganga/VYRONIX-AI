import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import FocusRoom from "./pages/FocusRoom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "focus">("landing");

  const navigate = (page: "landing" | "dashboard" | "focus") => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {currentPage === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={() => navigate("dashboard")} />
          </motion.div>
        ) : currentPage === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onFocusMode={() => navigate("focus")} onBack={() => navigate("landing")} />
          </motion.div>
        ) : (
          <motion.div
            key="focus"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FocusRoom onExit={() => navigate("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
