import "./App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AllStudentsMain from "./componenets/Students/allStudents";
import { Route, BrowserRouter as Router } from "react-router-dom";
import NavBar from "./componenets/navBar";
import AllProjects from "./componenets/Projects/allProjectsMain";
import ProjectPage from "./componenets/ProjectDetails/ProjectPage";

function App() {
  const [search, setSearch] = useState("");
  const searchResults = (res) => setSearch(res);

  return (
    <div className='App'>
      <Router>
        <NavBar searchResults={searchResults} />
        <Route path='/students' exact>
          <AllStudentsMain />
        </Route>
        <Route path='/projects' exact>
          <AllProjects seacrh={search} />
        </Route>
        <Route path='/projects/:id'>
          <AllProjects />
        </Route>
        <Route path='/project/:id'>
          <ProjectPage />
        </Route>
      </Router>
    </div>
  );
}

export default App;
