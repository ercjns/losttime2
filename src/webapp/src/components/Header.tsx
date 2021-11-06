import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import wordmark from  '../assets/LostTimeWordmark.svg';
import mapblur from '../assets/mapmontageblur.jpg';

export class Header extends React.Component<{}, {}, {}> {

  render () {
  return (
    <Navbar expand="md" style={{
      backgroundImage: `url(${mapblur})`,
      backgroundRepeat: 'repeat-xy',
      marginBottom: '20px',
      maxWidth: '100%',
      width: '100%'
    }}>
      <Navbar.Brand as={Link} to="/" style={{paddingLeft: '1rem'}}><img src={wordmark} alt="Lost Time Orienteering" style={{
              height: '60px',
              margin: '0px'
            }}></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginRight: '2rem'}}/>
      <Navbar.Collapse id="basic-navbar-nav" >
        <Nav>
          {/* <Nav.Link href="#events" style={{marginLeft: '1rem'}}>Events</Nav.Link> */}
          <NavDropdown title="Admin" id="basic-nav-dropdown" style={{marginLeft: '1rem'}}>
            <NavDropdown.Item as={Link} to="/registrations">Process Registrations</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/results">Add Results</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
  }
}