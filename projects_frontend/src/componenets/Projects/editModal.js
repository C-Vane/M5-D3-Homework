import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ImageUploader from "react-images-upload";

class EditModal extends React.Component {
  state = {
    form: {
      name: "",
      description: "",
      creationDate: "",
      studentID: "",
      repoUrl: "",
      liveUrl: "",
    },
    pictures: [],
  };
  componentDidMount() {
    this.setState({ form: this.props.form });
  }
  componentDidUpdate(prevProps) {
    prevProps.form !== this.props.form && this.setState({ form: this.props.form });
  }
  handelChange = (e) => {
    let form = { ...this.state.form };
    let currentId = e.currentTarget.id;
    form[currentId] = e.currentTarget.value;
    this.setState({ form });
  };
  profilePictureUploadHandler = (pictures) => this.setState({ pictures });
  postImage = async () => {
    let formData = new FormData();
    this.state.pictures.forEach((file) => {
      console.log(file);
      formData.append("projectImage", file);
    });
    console.log(formData);

    if (this.state.pictures.length > 0) {
      try {
        let response = await fetch("http://localhost:3001/projects/" + this.props.currentId + "/uploadPhotos", {
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
    const { modal, modalAdd, editModalToggleHandler, handelSubmit } = this.props;
    const { form } = this.state;
    return (
      <Modal show={modal} onHide={editModalToggleHandler}>
        <Form onSubmit={(e) => handelSubmit(e, this.state.form)}>
          <Modal.Header closeButton onClick={editModalToggleHandler}>
            <Modal.Title>{modalAdd ? "Add Project" : "Edit Project"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' id='name' value={form.name} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type='text' id='description' value={form.description} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Student ID</Form.Label>
              <Form.Control type='text' id='studentID' value={form.studentID} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Git repository Link</Form.Label>
              <Form.Control type='URL' id='repoUrl' value={form.repoUrl} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Link</Form.Label>
              <Form.Control type='URL' id='liveUrl' value={form.liveUrl} onChange={this.handelChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Creation Date</Form.Label>
              <Form.Control type='date' id='creationDate' value={form.creationDate} onChange={this.handelChange} required />
            </Form.Group>
            {form.name && (
              <ImageUploader
                withIcon={true}
                buttonText='Upload image'
                imgExtension={[".jpg", ".gif", ".png", ".gif", ".jpeg", ".JPG"]}
                maxFileSize={5242880}
                multiple={true}
                withPreview={true}
                withLabel={false}
                maxNumber={10}
                onChange={this.profilePictureUploadHandler}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={editModalToggleHandler} variant='secondary'>
              Cancel
            </Button>
            <Button variant='primary' type='submit' onClick={this.postImage}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
