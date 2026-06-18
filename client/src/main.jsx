import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Book from "./pages/Book";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"         element={<Navigate to="/services" replace />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/signup"   element={<Signup />} />
            <Route path="/services" element={<Services />} />
            <Route path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route path="/book/:serviceId"
              element={<ProtectedRoute><Book /></ProtectedRoute>}
            />
            <Route path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode><App /></StrictMode>
);