import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'


const Error401Page = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Image
            src="/images/errors/401.png"
            alt="Unauthorized"
           
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Error401Page;