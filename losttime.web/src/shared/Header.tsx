import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
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
          <Nav.Link href="/entries" style={{marginLeft: '1rem', fontWeight:'bold'}}>Manage Entries</Nav.Link>
          <Nav.Link href="/results" style={{marginLeft: '1rem', fontWeight:'bold'}}>Create Results</Nav.Link>
          <Nav.Link href="/docs" style={{marginLeft: '1rem', fontWeight:'bold'}}>Docs</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
  }
}