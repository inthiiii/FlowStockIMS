import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NavigationBar from "./components/NavigationBar";

// Public Pages (Header + Footer)
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductView from "./pages/ProductView";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Private Pages (Navigation Bar)
import DashboardPage from "./pages/DashboardPage";
import SalesDashboardPage from "./pages/SalesDashboardPage";
import SalesListPage from "./pages/SalesListPage";
import AddSalePage from "./pages/AddSalePage";
import SaleDetailsPage from "./pages/SaleDetailsPage";
import ReceiptPage from "./pages/ReceiptPage";
import EditSalePage from "./pages/EditSalePage";
import ProductAdd from "./pages/ProductAdd";
import ProductControl from "./pages/ProductControl";
import EditProduct from "./pages/EditProduct";
import CreateShipment from "./pages/CreateShipment";
import ShipmentControl from "./pages/ShipmentControl";
import ShipmentUpdate from "./pages/ShipmentUpdate";
import CreateDelivery from "./pages/CreateDelivery";
import DeliveryList from "./pages/DeliveryList";
import DeliveryUpdatePage from "./pages/DeliveryUpdatePage";
import ContactUsReceivePage from "./pages/ContactUsReceivePage";
import UserDashboard from "./pages/UserDashboard";
import UserControl from "./pages/UserControl";

// Layout wrapper for Navigation Pages
const NavigationLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavigationBar />
      <div style={{ flex: 1, background: "#f8f9fa", padding: "30px" }}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pages with Header + Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <AboutPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <ContactPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Header />
              <ProductView />
              <Footer />
            </>
          }
        />

        {/* Temporary Login Page (Header + Footer) */}
        <Route
          path="/login"
          element={
            <>
              <Header />
              <LoginPage />
              <Footer />
            </>
          }
        />

        {/* Forgot Password Page (Header + Footer) */}
        <Route
          path="/forgot-password"
          element={
            <>
              <Header />
              <ForgotPassword />
              <Footer />
            </>
          }
        />

        {/* Reset Password Page (Header + Footer) */}
        <Route
          path="/reset-password"
          element={
            <>
              <Header />
              <ResetPasswordPage />
              <Footer />
            </>
          }
        />

        {/* Register Page (Header + Footer) */}
        <Route
          path="/register"
          element={
            <>
              <Header />
              <RegisterPage />
              <Footer />
            </>
          }
        />

        {/* Pages with Navigation Bar */}
        <Route
          path="/dashboard"
          element={
            <NavigationLayout>
              <DashboardPage />
            </NavigationLayout>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <NavigationLayout>
              <UserDashboard />
            </NavigationLayout>
          }
        />
        <Route
          path="/user/control"
          element={
            <NavigationLayout>
              <UserControl />
            </NavigationLayout>
          }
        />
        <Route
          path="/contact/contactview"
          element={
            <NavigationLayout>
              <ContactUsReceivePage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/dashboard"
          element={
            <NavigationLayout>
              <SalesDashboardPage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/list"
          element={
            <NavigationLayout>
              <SalesListPage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/add"
          element={
            <NavigationLayout>
              <AddSalePage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/:id"
          element={
            <NavigationLayout>
              <SaleDetailsPage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/:id/receipt"
          element={
            <NavigationLayout>
              <ReceiptPage />
            </NavigationLayout>
          }
        />
        <Route
          path="/sales/edit/:id"
          element={
            <NavigationLayout>
              <EditSalePage />
            </NavigationLayout>
          }
        />
        <Route
          path="/products/entry"
          element={
            <NavigationLayout>
              <ProductAdd />
            </NavigationLayout>
          }
        />
        <Route
          path="/products/control"
          element={
            <NavigationLayout>
              <ProductControl />
            </NavigationLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <NavigationLayout>
              <EditProduct />
            </NavigationLayout>
          }
        />
        <Route
          path="/shipments/create"
          element={
            <NavigationLayout>
              <CreateShipment />
            </NavigationLayout>
          }
        />
        <Route
          path="/shipments/control"
          element={
            <NavigationLayout>
              <ShipmentControl />
            </NavigationLayout>
          }
        />
        <Route
          path="/shipments/update/:id"
          element={
            <NavigationLayout>
              <ShipmentUpdate />
            </NavigationLayout>
          }
        />
        <Route
          path="/deliveries/create"
          element={
            <NavigationLayout>
              <CreateDelivery />
            </NavigationLayout>
          }
        />
        <Route
          path="/deliveries/list"
          element={
            <NavigationLayout>
              <DeliveryList />
            </NavigationLayout>
          }
        />
        <Route
          path="/deliveries/update/:id"
          element={
            <NavigationLayout>
              <DeliveryUpdatePage />
            </NavigationLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;