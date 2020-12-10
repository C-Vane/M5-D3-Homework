import React from "react";
import { Button, Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const StudentsTable = (props) => {
  const { students, editStudent, deleteStudent } = props;
  return (
    <Table striped bordered hover variant='dark'>
      <thead>
        <tr>
          <th>#</th>
          <th>First name</th>
          <th>Last name</th>
          <th>email</th>
          <th>Date of birth</th>
          <th>Edit/Delete</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, i) => (
          <tr key={i}>
            <td>
              {i + 1} <Image src={student.image ? student.image : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"} height='30px' />
            </td>
            <td>{student.name}</td>
            <td>{student.surname}</td>
            <td>{student.email}</td>
            <td>{student.dateofBirth}</td>
            <td>
              <Button variant='warning' onClick={() => editStudent(student.ID)}>
                Edit
              </Button>
              <Button onClick={() => deleteStudent(student.ID)} variant='danger'>
                Delete
              </Button>
              <Link to={"/projects/" + student.ID + "/" + student.name + " " + student.surname}>
                <Button> Projects</Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentsTable;
