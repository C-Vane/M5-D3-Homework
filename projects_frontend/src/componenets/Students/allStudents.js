import React from "react";
import { Button, Container, Spinner, Form, Alert, Row } from "react-bootstrap";
import { deleteFunction, getFunction, postFunction, putFunction } from "../CURDFunction.js";
import EditModal from "./editModal.js";
import StudentsTable from "./studentsTable.js";

class AllStudentsMain extends React.Component {
  state = {
    form: {
      name: "",
      surname: "",
      email: "",
      dateofBirth: "",
    },
    students: [],
    loaded: false,
    modal: false,
    modalAdd: true,
    currentId: "",
    status: "",
    variant: "success",
    email: "",
  };
  componentDidMount = () => {
    setTimeout(() => {
      this.getStudents();
    }, 1000);
  };
  //GET ALL STUDENTS
  getStudents = async () => {
    let students = await getFunction("/students");
    if (students.length > 0) {
      this.setState({ students, loaded: true, variant: "success" });
      setTimeout(() => {
        this.setState({ status: "" });
      }, 2000);
    }
  };

  //ADD NEW STUDENT
  postStudent = async (data) => {
    let response = await postFunction("/students/", data);
    if (response) {
      this.setState({
        form: {
          name: "",
          surname: "",
          email: "",
          dateofBirth: "",
        },
        status: "New Student successfully Added",
        modal: false,
        loaded: false,
      });
      setTimeout(() => {
        this.getStudents();
      }, 1000);
    } else {
      this.setState({
        status: "Error has been used by other student",
        variant: "danger",
        modal: false,
      });
      setTimeout(() => {
        this.setState({
          status: "",
          variant: "success",
        });
      }, 3000);
    }
  };
  //EDIT STUDENT
  putStudent = (id, data) => {
    if (putFunction("/students/" + id, data)) {
      this.setState({
        form: {
          name: "",
          surname: "",
          email: "",
          dateofBirth: "",
        },
        modalAdd: true,
        modal: false,
        currentId: "",
        loaded: false,
        status: "Student data successfully edited",
      });
      setTimeout(() => {
        this.getStudents();
      }, 1000);
    }
  };
  deleteStudent = (id) => {
    if (deleteFunction("/students/" + id)) {
      this.setState({ status: "Student has been successfully deleted", loaded: false });
      setTimeout(() => {
        this.getStudents();
      }, 1000);
    }
  };

  handelSubmit = (event, data) => {
    event.preventDefault();
    let id = this.state.currentId;
    this.state.modalAdd ? this.postStudent(data) : this.putStudent(id, data);
  };
  editStudent = (id) => {
    if (id) {
      const currentStudent = this.state.students.filter((student) => student.ID === id);
      const form = { ...this.state.form };
      form.name = currentStudent[0].name;
      form.surname = currentStudent[0].surname;
      form.email = currentStudent[0].email;
      form.dateofBirth = currentStudent[0].dateofBirth;
      this.setState({ form, modalAdd: false, currentId: id });
    } else this.setState({ form: { name: "", surname: "", email: "", dateofBirth: "" }, modalAdd: true });
    this.editModalToggleHandler();
  };
  editModalToggleHandler = () => {
    this.state.modal ? this.setState({ modal: false }) : this.setState({ modal: true });
  };

  //CHECK eMAIL
  checkemail = async (event) => {
    event.preventDefault();
    let body = {
      email: this.state.email,
    };
    try {
      const response = await fetch("http://localhost:3001/students/checkemail", {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });

      if (response.status !== 210) {
        this.setState({
          email: "",
          status: "No other student has this email",
        });
        setTimeout(() => {
          this.setState({ status: "" });
        }, 2500);
      } else {
        this.setState({
          email: "",
          status: "Email has already been used by other student",
          variant: "danger",
        });
        setTimeout(() => {
          this.setState({ status: "", variant: "success" });
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    }
  };
  handelChange = (e) => this.setState({ email: e.currentTarget.value });
  render() {
    const { loaded, students, modal, modalAdd, form } = this.state;
    return (
      <>
        <Container>
          <h1>Students</h1>
          <Button variant='warning' onClick={() => this.editStudent()}>
            Add Student
          </Button>
          <section>
            {this.state.status.length > 0 && <Alert variant={this.state.variant}>{this.state.status}</Alert>}

            <Row className='justify-content-center mt-4'>
              {loaded ? (
                <StudentsTable students={students} editStudent={this.editStudent} deleteStudent={this.deleteStudent} />
              ) : (
                <Spinner animation='border' role='status'>
                  <span className='sr-only'>Loading...</span>
                </Spinner>
              )}
            </Row>
          </section>
          <div>
            <h2>Check email</h2>
            <Form onSubmit={this.checkemail}>
              <Form.Group>
                <Form.Label>Check email</Form.Label>
                <Form.Control type='email' id='emailCheck' value={this.state.email} onChange={this.handelChange} />
              </Form.Group>
            </Form>
          </div>
        </Container>
        <EditModal modal={modal} modalAdd={modalAdd} editModalToggleHandler={this.editModalToggleHandler} handelSubmit={this.handelSubmit} form={form} />
      </>
    );
  }
}

export default AllStudentsMain;
