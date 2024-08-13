import React from 'react'
import {Container, Row, Col} from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3 footer">
                   <p>VMApay Trading &copy; {currentYear}</p>
                   <p>Email us at VMApay@gmail.com</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer;