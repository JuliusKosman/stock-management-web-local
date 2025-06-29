import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import StockInPage from "./pages/StockInPage.js";
import StockOutPage from "./pages/StockOutPage.js";
import ActivityLogsPage from "./pages/ActivityLogsPage.js";
import AccountSettingsPage from "./pages/AccountSettingsPage.js";
import RestockAlertPage from "./pages/RestockAlertPage.js";
import OverstockAlertPage from "./pages/OverstockAlertPage.js";
import ProductDetailPage from "./pages/ProductDetailPage.js";
import Layout from "./components/Layout.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Semua halaman utama dibungkus Layout Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stock-in" element={<StockInPage />} />
          <Route path="/stock-out" element={<StockOutPage />} />
          <Route path="/activity-logs" element={<ActivityLogsPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/restock-alert" element={<RestockAlertPage />} />
          <Route path="/overstock-alert" element={<OverstockAlertPage />} />
          <Route path="/activity-logs" element={<ActivityLogsPage />} />
          <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
