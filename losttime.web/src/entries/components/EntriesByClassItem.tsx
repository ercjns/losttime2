import React from 'react';
import { Col } from 'react-bootstrap';

export class EntriesByClassItem extends React.Component<{classname:string, regcount:number}, {}, {}> {

  render () {
    return (
      <Col xs={4} sm={3} md={4} lg={3}><b>{this.props.classname}</b>: {this.props.regcount}</Col>
    )
  }
}