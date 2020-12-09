import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

class EditModal extends React.Component {
  state = {
    form: {
      name: "",
      surname: "",
      email: "",
      dateofBirth: "",
    },
  };
  componentDidMount = () => {
    this.setState({ form: this.props.form });
  };
  componentDidUpdate(prevProps) {
    prevProps.form !== this.props.form && this.setState({ form: this.props.form });
  }
  handelChange = (e) => {
    let form = { ...this.state.form };
    let currentId = e.currentTarget.id;
    form[currentId] = e.currentTarget.value;
    this.setState({ form });
  };
  render() {
    const { modal, modalAdd, editModalToggleHandler, handelSubmit } = this.props;
    const { form } = this.state;
    return (
      <Modal show={modal} onHide={editModalToggleHandler}>
        <Form onSubmit={(e) => handelSubmit(e, this.state.form)}>
          <Modal.Header closeButton onClick={editModalToggleHandler}>
            <Modal.Title>{modalAdd ? "Add Student" : "Edit Student"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>name</Form.Label>
              <Form.Control type='text' id='name' value={form.name} onChange={this.handelChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>surname</Form.Label>
              <Form.Control type='text' id='surname' value={form.surname} onChange={this.handelChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>email</Form.Label>
              <Form.Control type='email' id='email' value={form.email} onChange={this.handelChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type='date' id='dateofBirth' value={form.dateofBirth} onChange={this.handelChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={editModalToggleHandler} variant='secondary'>
              Cancel
            </Button>
            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
