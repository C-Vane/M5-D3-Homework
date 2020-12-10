import React from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import ProjectImages from "./ProjectImages";
import Reviews from "./Reviews";
import StudentDetalis from "./StudentDetalis";
import { Link, withRouter } from "react-router-dom";
import { deleteFunction, getFunction, postFunction, putFunction } from "../CURDFunction.js";

class ProjectPage extends React.Component {
  state = {
    projectID: this.props.match.params.id,
    project: {},
    student: {},
    loaded: false,
  };
  getProject = async () => {
    let project = await getFunction("/projects/" + this.state.projectID);
    if (project) {
      this.setState({ project: project[0], loaded: true });
      console.log(project);
    }
  };
  getStudent = async (id) => {
    let student = await getFunction("/students/" + id);
    if (student) {
      this.setState({ student: student[0], loaded: true });
      console.log(student);
    }
  };
  componentDidMount = async () => {
    await this.getProject();
    this.state.project && this.getStudent(this.state.project.studentID);
  };
  render() {
    const { projectID, student, project } = this.state;
    console.log(student);
    return (
      <div>
        <Container>
          <Row>
            <Col md={8}>
              <Row>
                <Col>
                  <h1>{project.name}</h1>
                  <h6>About the project</h6>
                  <p>Description:{project.description}</p>
                  <p>Project created on the: {project.creationDate}</p>
                </Col>
              </Row>

              <Row>
                {project ? (
                  <ProjectImages images={project.image} />
                ) : (
                  <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </Spinner>
                )}
              </Row>

              <Row>
                {" "}
                <Col>
                  <p>
                    Project git repo: <a src={project.repoUrl}> Git Hub</a>
                  </p>
                  <p>
                    Project Site: <a src={project.liveUrl}> Live</a>
                  </p>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Row>
                {student ? (
                  <StudentDetalis student={student} />
                ) : (
                  <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </Spinner>
                )}
              </Row>
              <Row>
                <Reviews projectID={projectID} />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(ProjectPage);
