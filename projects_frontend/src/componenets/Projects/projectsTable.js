import React from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProjectsTable = (props) => {
  const { projects, editProject, deleteProject } = props;
  return (
    <Table striped bordered hover variant='dark'>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Creation Date</th>
          <th>Repo</th>
          <th>Live</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{project.name}</td>
            <td>{project.description}</td>
            <td>{project.creationDate}</td>
            <td>
              <a href={project.repoUrl}>Git Repo</a>
            </td>
            <td>
              <a href={project.liveUrl}>Live</a>
            </td>
            <td>
              <Button variant='warning' onClick={() => editProject(project.ID)}>
                Edit
              </Button>
              <Button onClick={() => deleteProject(project.ID)} variant='danger'>
                Delete
              </Button>
              {/*<Link to={"/project/" + project.ID}>
                <Button> Project Details</Button>
        </Link>*/}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProjectsTable;
