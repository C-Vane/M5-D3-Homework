import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ImageUploader from "react-images-upload";

class EditModal extends React.Component {
  state = {
    form: {
      name: "",
      surname: "",
      email: "",
      dateofBirth: "",
    },
    profilePicture: [],
  };
  componentDidMount = () => {
    this.setState({ form: this.props.form });
  };
  componentDidUpdate(prevProps) {
    prevProps.form !== this.props.form && this.setState({ form: this.props.form });
  }
  handelChange = (e) => {
    let form = { ...this.state.form };
    let current = e.currentTarget.id;
    form[current] = e.currentTarget.value;
    this.setState({ form });
  };
  profilePictureUploadHandler = (profilePicture) => this.setState({ profilePicture });
  postPicture = async () => {
    let formData = new FormData();
    let blob = new Blob([this.state.profilePicture[0]], { type: "img/jpeg" });
    formData.append("studentProfile", this.state.profilePicture[0]);
    console.log(this.state.profilePicture[0]);

    if (this.state.profilePicture.length > 0) {
      try {
        let response = await fetch("http://localhost:3001/students/" + this.props.currentId + "/uploadPhoto", {
          method: "POST",
          body: formData,
          redirect: "follow",
        });
        if (response.ok) {
          console.log(await response.json());
        } else {
          console.log(await response.json());
        }
      } catch (er) {
        console.log(er);
      }
    }
  };
  render() {
    const { modal, modalAdd, editModalToggleHandler, handelSubmit, currentId } = this.props;
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
              <Form.Control type='text' id='name' value={form.name} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>surname</Form.Label>
              <Form.Control type='text' id='surname' value={form.surname} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>email</Form.Label>
              <Form.Control type='email' id='email' value={form.email} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type='date' id='dateofBirth' value={form.dateofBirth} onChange={this.handelChange} required />
            </Form.Group>

            {currentId && (
              <ImageUploader
                withIcon={true}
                buttonText='Upload image'
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
                singleImage={true}
                withPreview={true}
                withLabel={false}
                onChange={this.profilePictureUploadHandler}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={editModalToggleHandler} variant='secondary'>
              Cancel
            </Button>
            <Button variant='primary' type='submit' onClick={this.postPicture}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
