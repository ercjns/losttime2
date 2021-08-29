import React from 'react';
import { Row, Col } from 'react-bootstrap';
import wordmark from  '../assets/LostTimeWordmark.svg';
import mapblur from '../assets/mapmontageblur.jpg';

export class Header extends React.Component<{}, {}, {}> {

  render () {
  return (
    <Row>
    <nav className="nav-bar" style={{
      backgroundImage: `url(${mapblur})`,
      backgroundRepeat: 'repeat-xy',
      marginBottom: '20px'
    }}>
      <Col xs={{span:10, offset:1}}>
        <div className="nav-img" style={{
          paddingTop: '5px',
          paddingBottom: '5px'
        }}>
          <a href="/">
            <img src={wordmark} alt="Lost Time Orienteering" style={{
              height: '60px',
              margin: '0px'
            }}></img>
          </a>
        </div>
      </Col>
    </nav>
    </Row>
  );
  }
}