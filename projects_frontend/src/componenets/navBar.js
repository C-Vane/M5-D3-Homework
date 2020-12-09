import React from "react";
import { Navbar, Nav, Form, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

class NavBar extends React.Component {
  state = {
    search: "",
  };
  handleChange = (e) => this.setState({ search: e.currentTarget.value });
  handleSearch = (e) => {
    e.preventDefault();
    this.props.searchResults(this.state.search);
  };
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand='md' bg='dark' variant='dark'>
          <Link to='/'>
            <Navbar.Brand>Strive Student Portfolio</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='mr-auto'>
              <Link to='/students'>
                <div className={this.props.location.pathname === "/students" ? "nav-link active" : "nav-link"}>Students</div>
              </Link>
              <Link to='/projects'>
                <div className={this.props.location.pathname === "/projects" ? "nav-link active" : "nav-link"}>Projects</div>
              </Link>
            </Nav>

            {this.props.location.pathname === "/projects" && (
              <Form inline onSubmit={this.handleSearch}>
                <Form.Control type='text' placeholder='Search' onInput={this.handleChange} value={this.state.search} className='mr-sm-2' />
                <Button variant='outline-dark' type='submit'>
                  Search
                </Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);
