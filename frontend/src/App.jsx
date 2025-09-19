import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ContactUsReceivePage from "./pages/ContactUsReceivePage";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* Header at top */}
        <Header />

        {/* Main content area */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/contact" element={<ContactUsReceivePage />} />
          </Routes>
        </main>

        {/* Footer at bottom */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;