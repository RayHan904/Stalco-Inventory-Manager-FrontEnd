
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import { createRoot } from "react-dom/client";
import { SelectedCustomerProvider } from "./contexts/SelectedCustomerContext";
import CustomerDashboard from "./screens/CustomerDashboard";
import { LoadingProvider } from "./contexts/LoadingContext";
import Replenishments from "./screens/Replenishments";
import { CustomersProvider } from "./contexts/CustomerContext";
import OrdersDashboard from "./screens/OrdersDashboard";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found in the DOM.");
}

const router = (
  <SelectedCustomerProvider>
    <CustomersProvider>
    <LoadingProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index path="/" element={<Home />} />
        <Route path="/replenishments" element={<Replenishments />} />
        <Route path="/ordersDashboard" element={<OrdersDashboard />} />
        {/* <Route path="/orders/:customerName" element={<CustomerDashboard />} />  */}
        <Route path="/Dashboard/:customerName" element={<CustomerDashboard />} /> 
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </LoadingProvider>
  </CustomersProvider>
  </SelectedCustomerProvider>

);

const root = createRoot(rootElement);

root.render(router);
