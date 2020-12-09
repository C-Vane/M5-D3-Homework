import "./App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AllStudentsMain from "./componenets/Students/allStudents";
import { Route, BrowserRouter as Router } from "react-router-dom";
import NavBar from "./componenets/navBar";
import AllProjects from "./componenets/Projects/allProjectsMain";

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
      </Router>
    </div>
  );
}

export default App;
