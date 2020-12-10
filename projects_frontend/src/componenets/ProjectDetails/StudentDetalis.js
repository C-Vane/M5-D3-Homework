import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

class StudentDetalis extends React.Component {
  render() {
    const { student } = this.props;
    console.log(this.props);
    return (
      <div>
        <Card>
          <Card.Img variant='top' src={student.image ? student.image : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"} />
          <Card.Body>
            <Card.Title>
              {student.name} {student.surname}
            </Card.Title>
            <Card.Text></Card.Text>
            <Link to={"/projects/" + student.ID + "/" + student.name + " " + student.surname}>
              <Button variant='primary'>Go somewhere</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default StudentDetalis;
