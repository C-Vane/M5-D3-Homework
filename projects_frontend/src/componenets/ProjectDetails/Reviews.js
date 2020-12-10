import React from "react";
import { Button, Card, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { deleteFunction, getFunction, postFunction, putFunction } from "../CURDFunction.js";

class Reviews extends React.Component {
  state = {
    reviews: [],
    form: {
      name: "",
      text: "",
      projectID: this.props.projectID,
    },
    projectID: this.props.projectID,
    variant: "success",
    status: "",
  };
  // get reviews
  getReviews = async () => {
    let reviews = await getFunction("/projects/" + this.state.projectID + "/reviews");
    if (reviews) {
      this.setState({ reviews, loaded: true });
      console.log(reviews);
    }
  };
  componentDidUpdate = (prevProp) => {};
  componentDidMount = () => {
    this.getReviews();
  };
  // post reviews
  postReviews = async (e, data) => {
    e.preventDefault();
    let response = await postFunction("/projects/" + this.state.projectID + "/reviews", data);
    if (response === true) {
      this.setState({
        form: {
          name: "",
          text: "",
        },
        status: "New Review successfully Added",
      });
      setTimeout(() => {
        this.getReviews();
      }, 1000);
    } else {
      this.setState({
        status: response.length < 30 ? response : response.split('"msg":')[1].split(",")[0],
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
  //handle change
  handleChange = (e) => {
    const form = { ...this.state.form };
    form[e.currentTarget.id] = e.currentTarget.value;
    this.setState({ form });
  };
  render() {
    const { reviews, form } = this.state;
    return (
      <div>
        <Card className='mt-5'>
          <Card.Body>
            <Card.Title>Reviews</Card.Title>
          </Card.Body>
          <ListGroup className='list-group-flush'>
            {reviews &&
              reviews.map((review) => (
                <ListGroupItem>
                  <small>{review.name}</small>
                  <p>{review.text}</p>
                </ListGroupItem>
              ))}
          </ListGroup>
          <Card.Body>
            <Form onSubmit={(e) => this.postReviews(e, form)}>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' id='name' value={form.name} onChange={this.handleChange} />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlTextarea1'>
                <Form.Label>Leave a review</Form.Label>
                <Form.Control as='textarea' id='text' value={form.text} rows={3} onChange={this.handleChange} />
              </Form.Group>
              <Button type='submit'>Send</Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Reviews;
