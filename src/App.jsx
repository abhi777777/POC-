import React from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import "./index.css";
import ProducerDashBoard from "./pages/producer/ProducerDashBoard";
import ConsumerDashBoard from "./pages/consumer/ConsumerDashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RaiseTicketForm from "./components/RaiseTicketForm";
import BuyPolicy from "./components/BuyPolicy";
import PoliciesList from "./components/PoliciesList";
import PurchasedPolicies from "./components/PurchasedPolicies";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/ProducerDashBoard"
          element={
            <ProtectedRoute>
              <ProducerDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ConsumerDashBoard"
          element={
            <ProtectedRoute>
              <ConsumerDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RaiseTicketForm"
          element={
            <ProtectedRoute>
              <RaiseTicketForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BuyPolicy"
          element={
            <ProtectedRoute>
              <BuyPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PoliciesList"
          element={
            <ProtectedRoute>
              <PoliciesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PurchasedPolicies"
          element={
            <ProtectedRoute>
              <PurchasedPolicies />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
