import React from "react";
import { Button, Container, Row, Spinner, Alert } from "react-bootstrap";
import { deleteFunction, getFunction, postFunction, putFunction } from "../CURDFunction.js";
import EditModal from "./editModal.js";
import ProjectsTable from "./projectsTable.js";
import { withRouter } from "react-router-dom";

class AllProjects extends React.Component {
  state = {
    form: {
      name: "",
      description: "",
      creationDate: "",
      studentID: "",
      repoUrl: "",
      liveUrl: "",
    },
    projects: [],
    loaded: false,
    modal: false,
    modalAdd: true,
    currentId: "",
    status: "",
    variant: "success",
    searchString: "",
  };
  componentDidMount = () => {
    setTimeout(() => {
      this.getProjects();
    }, 1000);
  };
  //FOR THE SEARCH
  componentDidUpdate = (prevProps) => {
    prevProps.search !== this.props.search && this.setState({ searchString: this.props.search });
  };
  /*   const handleSearch = async (search) => {
    const searchResults = await getFunction("/projects/?name=" + search);
    this.setState({projects:searchResults});
  }; */
  //GET ALL projects
  getProjects = async () => {
    let projects = this.props.match.params.id ? await getFunction("/students/" + this.props.match.params.id + "/projects") : await getFunction("/projects");
    if (projects) {
      this.setState({ projects, loaded: true, variant: "success" });
      setTimeout(() => {
        this.setState({ status: "" });
      }, 2000);
    }
  };

  //ADD NEW Project
  postProject = async (data) => {
    let response = await postFunction("/projects/", data);
    if (response) {
      this.setState({
        form: {
          name: "",
          description: "",
          creationDate: "",
          studentID: "",
          repoUrl: "",
          liveUrl: "",
        },
        status: "New Project successfully Added",
        modal: false,
        loaded: false,
      });
      setTimeout(() => {
        this.getProjects();
      }, 1000);
    } else {
      this.setState({
        status: "Error wrong student ID",
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
  //EDIT Project
  putProjects = (id, data) => {
    if (putFunction("/projects/" + id, data)) {
      this.setState({
        form: {
          name: "",
          description: "",
          creationDate: "",
          studentID: "",
          repoUrl: "",
          liveUrl: "",
        },
        modalAdd: true,
        modal: false,
        currentId: "",
        loaded: false,
        status: "Project data successfully edited",
      });
      setTimeout(() => {
        this.getProjects();
      }, 1000);
    } else {
      this.setState({
        status: "Error wrong student ID",
        variant: "danger",
      });
      setTimeout(() => {
        this.setState({
          status: "",
          variant: "success",
        });
      }, 3000);
    }
  };
  deleteProject = (id) => {
    if (deleteFunction("/projects/" + id)) {
      this.setState({ status: "Project has been successfully deleted", loaded: false });
      setTimeout(() => {
        this.getProjects();
      }, 1000);
    }
  };

  handelSubmit = (event, data) => {
    event.preventDefault();
    let id = this.state.currentId;
    this.state.modalAdd ? this.postProject(data) : this.putProjects(id, data);
  };
  editProject = (id) => {
    if (id) {
      const currentProject = this.state.projects.filter((Project) => Project.ID === id);
      const form = { ...this.state.form };
      form.name = currentProject[0].name;
      form.description = currentProject[0].description;
      form.creationDate = currentProject[0].creationDate;
      form.studentID = currentProject[0].studentID;
      form.repoUrl = currentProject[0].repoUrl;
      form.liveUrl = currentProject[0].liveUrl;
      this.setState({ form, modalAdd: false, currentId: id });
    } else this.setState({ form: { name: "", description: "", creationDate: "", studentID: this.props.match.params.id ? this.props.match.params.id : "", repoUrl: "", liveUrl: "" }, modalAdd: true });

    this.editModalToggleHandler();
  };
  editModalToggleHandler = () => {
    this.state.modal ? this.setState({ modal: false }) : this.setState({ modal: true });
  };

  render() {
    const { loaded, projects, modal, modalAdd, form } = this.state;
    return (
      <>
        <Container>
          <h1>{this.props.match.params.id ? this.props.location.pathname.split("/")[3] + "'s" : "Student"} Projects</h1>
          <Button variant='warning' onClick={() => this.editProject()}>
            Add Project
          </Button>
          <section>
            {this.state.status.length > 0 && <Alert variant={this.state.variant}>{this.state.status}</Alert>}
            <Row className='justify-content-center mt-4'>
              {loaded ? (
                <ProjectsTable projects={projects} editProject={this.editProject} deleteProject={this.deleteProject} />
              ) : (
                <Spinner animation='border' role='status'>
                  <span className='sr-only'>Loading...</span>
                </Spinner>
              )}
            </Row>
          </section>
        </Container>
        <EditModal modal={modal} modalAdd={modalAdd} editModalToggleHandler={this.editModalToggleHandler} handelSubmit={this.handelSubmit} form={form} />
      </>
    );
  }
}

export default withRouter(AllProjects);
