import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/homePage.jsx";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import VerificationPage from "./pages/VerificationPage";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Emailverification from "./components/verification/Emailverification";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated } from "./lib/authUtils";
import { useEffect } from "react";

function App() {
  const isLoggedIn = isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && window.location.pathname === "/login") {
      navigate("/chat");
    }
  }, [isLoggedIn]);
  return (
    <div>
      <ToastContainer
        position="top-center"
        transition={Flip}
        autoClose={2000}
        limit={2}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/chat" replace /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/chat" /> : <SignupPage />}
        />

        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/verify/:token" element={<Emailverification />} />

        <Route path="/chat" element={<PrivateRoute component={ChatPage} />} />
      </Routes>
    </div>
  );
}

export default App;
