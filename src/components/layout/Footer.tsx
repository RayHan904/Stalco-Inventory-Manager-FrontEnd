import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#dbeaff' }}>
      <Container>
        <Row>
          <Col className="text-center py-1">
            <p>Stalco Inventory Manager &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
