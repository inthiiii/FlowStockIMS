import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NavigationBar from "./components/NavigationBar";

import HomePage from "./pages/HomePage";  
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductView from "./pages/ProductView";
import ContactUsReceivePage from "./pages/ContactUsReceivePage";

// Sales Pages
import SalesDashboardPage from "./pages/SalesDashboardPage";
import SalesListPage from "./pages/SalesListPage";
import AddSalePage from "./pages/AddSalePage";
import SaleDetailsPage from "./pages/SaleDetailsPage";
import ReceiptPage from "./pages/ReceiptPage";
import EditSalePage from "./pages/EditSalePage";

// Product Pages
import ProductAdd from "./pages/ProductAdd";
import ProductControl from "./pages/ProductControl";
import EditProduct from "./pages/EditProduct";

// Shipment Pages
import CreateShipment from "./pages/CreateShipment";
import ShipmentControl from "./pages/ShipmentControl";
import ShipmentUpdate from "./pages/ShipmentUpdate";

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
            <Route path="/products" element={<ProductView />} />

            {/* Contact Us Receive Route */}  
            <Route path="/contact/viewcontact" element={<ContactUsReceivePage />} />

            {/* Sales Routes */}
            <Route path="/sales/dashboard" element={<SalesDashboardPage />} />
            <Route path="/sales/list" element={<SalesListPage />} />
            <Route path="/sales/add" element={<AddSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailsPage />} />
            <Route path="/sales/:id/receipt" element={<ReceiptPage />} />
            <Route path="/sales/edit/:id" element={<EditSalePage />} />

            {/* Product Routes */}
            <Route path="/products/entry" element={<ProductAdd />} />
            <Route path="/products/control" element={<ProductControl />} />
            <Route path="/product/:id" element={<EditProduct />} />

            {/* Shipment Routes */}
            <Route path="/shipments/create" element={<CreateShipment />} />
            <Route path="/shipments/control" element={<ShipmentControl />} />
            <Route path="/shipments/update/:id" element={<ShipmentUpdate />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;