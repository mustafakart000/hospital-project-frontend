import React from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

const Error404Page = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Image
            src="/images/errors/404.png"
            alt="Not found"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Error404Page;
