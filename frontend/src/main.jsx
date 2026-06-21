import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import "./index.css";
import Appointment from "./Appointment";
import App from "./App";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import MedicineReminder from "./MedicineReminder";
import EmergencySOS from "./EmergencySOS";
import HealthMonitor from "./HealthMonitor";
import History from "./History";
import Prediction from "./Prediction";
import Profile from "./Profile";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="273945152518-00hi7qqm05td53ctogkhkmvdg3a0164s.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#0f172a",
              color: "#fff",
            },
            success: {
              duration: 2500,
            },
          }}
        />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/health-monitor" element={<HealthMonitor />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Login />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<History />} />
          <Route path="/appointment" element={<Appointment />} />

          <Route path="/medicine-reminder" element={<MedicineReminder />} />

          <Route path="/sos" element={<EmergencySOS />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
