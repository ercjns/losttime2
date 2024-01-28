import { Guid } from 'guid-typescript';
import React from 'react';

export type RaceFileListItemProps = {
    name: string,
    raceClasses: number,
  }

export class RaceFileListItem extends React.Component<RaceFileListItemProps, {}, any> {

  render () {
    return (
      <li key={this.props.name} >Race Splits File: {this.props.name} (Found <b>{this.props.raceClasses}</b> race classes.)</li>
    )
  }
}