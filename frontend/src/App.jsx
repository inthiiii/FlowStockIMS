// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";  
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ContactUsReceivePage from "./pages/ContactUsReceivePage";

// Sales Pages
import SalesDashboardPage from "./pages/SalesDashboardPage";
import SalesListPage from "./pages/SalesListPage";
import AddSalePage from "./pages/AddSalePage";
import SaleDetailsPage from "./pages/SaleDetailsPage";
import ReceiptPage from "./pages/ReceiptPage";

// Log and Attendance Pages
import AddInternalUserPage from "./pages/AddInternalUserPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact/viewcontact" element={<ContactUsReceivePage />} />
            {/* Sales Routes */}
            <Route path="/sales/dashboard" element={<SalesDashboardPage />} />
            <Route path="/sales/list" element={<SalesListPage />} />
            <Route path="/sales/add" element={<AddSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailsPage />} />
            <Route path="/sales/:id/receipt" element={<ReceiptPage />} />
            {/* Log and Attendance Routes */}
            <Route path="/internal-users/add" element={<AddInternalUserPage />} />
            <Route path="/attendance/manage" element={<AttendanceManagementPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;