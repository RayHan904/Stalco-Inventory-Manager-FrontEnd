import React from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet, HelmetProvider } from "react-helmet-async";


const App: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home - Stalco Inventory Manager";
      default:
        return "Inventory Manager";
    }
  };

  return (
    <HelmetProvider>
      <ToastContainer />
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </HelmetProvider>
  );
};

export default App;
