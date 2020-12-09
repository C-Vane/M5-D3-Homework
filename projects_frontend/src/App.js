import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AllStudentsMain from "./componenets/Students/allStudents";
import { Route, BrowserRouter as Router } from "react-router-dom";
import NavBar from "./componenets/navBar";
import AllProjects from "./componenets/Projects/allProjectsMain";

function App() {
  return (
    <div className='App'>
      <Router>
        <NavBar />
        <Route path='/students' exact>
          <AllStudentsMain />
        </Route>
        <Route path='/projects' exact>
          <AllProjects />
        </Route>
        <Route path='/projects/:id'>
          <AllProjects />
        </Route>
      </Router>
    </div>
  );
}

export default App;
