import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPro from "./pages/DashboardPro";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { initGA, logPageView, logEvent, logSessionDuration } from "./analytics";

initGA();

function GAListener({ children }) {
  const location = useLocation();
  const [sessionStart] = useState(Date.now());

  useEffect(() => {
    logPageView(location.pathname + location.search);
    logEvent("User", "engagement", location.pathname);
  }, [location]);

  useEffect(() => {
    return () => {
      const userEmail = localStorage.getItem("email");
      logSessionDuration(sessionStart, userEmail);
    };
  }, [sessionStart]);

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <GAListener>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </GAListener>
      </Router>
    </AuthProvider>
  );
}

export default App;
