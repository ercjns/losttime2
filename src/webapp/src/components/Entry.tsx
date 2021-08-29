import React from 'react';
import { LtEntry } from '../lt/Entry';

export class Entry extends React.Component<{value: LtEntry}, {}, {}> {

  render () {
  return (
    <tr>
      <td>{this.props.value.FirstName}</td>
      <td>{this.props.value.LastName}</td>
      <td>{this.props.value.Epunch}</td>
      <td style={{textAlign:'center'}}>{this.props.value.EpunchRented? "yes": "no"}</td>
      <td>{this.props.value.ClassId}</td>
      <td>{this.props.value.StartNo}</td>
    </tr>
  );
  }

}