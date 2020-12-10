import React from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

const ProjectImages = (props) => {
  return (
    <div>
      <Container>
        <Row>
          {props.images &&
            props.images.map((image) => (
              <Col md={4}>
                <Image src={image} fluid />
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProjectImages;
