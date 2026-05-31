import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  return localStorage.getItem("accessToken") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Navbar /><Tasks /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Navbar /><Analytics /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}