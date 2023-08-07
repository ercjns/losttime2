import React from 'react';

export type splitsByClassXmlMeta = {
    name: string,
    success: number
  }

export class SplitsByClassXml extends React.Component<splitsByClassXmlMeta, {}, any> {

  render () {
    return (
      <li>{this.props.name} (Race Classes: {this.props.success})</li>
    )
  }
}