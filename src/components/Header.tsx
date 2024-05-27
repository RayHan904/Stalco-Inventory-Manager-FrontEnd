import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/stalco logo.png";

const Header: React.FC = () => {
  const setActiveLink = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <NavLink to="/" className="d-flex align-items-center navbar-brand">
            <img
              src={logo}
              alt="Stalco Logo"
              height="47"
              style={{ marginRight: "15px" }}
            />
            <span style={{ fontSize: "1.1rem" }}>Inventory Manager</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink to="/" className={setActiveLink}>
                Home
              </NavLink>
              <NavLink to="/replenishments" className={setActiveLink}>
                Replenishment
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
