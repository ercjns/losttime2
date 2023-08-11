import React from 'react';

export type splitsByClassXmlMeta = {
    name: string,
    raceClasses: number
  }

export class SplitsByClassXml extends React.Component<splitsByClassXmlMeta, {}, any> {

  render () {
    return (
      <li>Race Splits File: {this.props.name} (Found <b>{this.props.raceClasses}</b> race classes.)</li>
    )
  }
}