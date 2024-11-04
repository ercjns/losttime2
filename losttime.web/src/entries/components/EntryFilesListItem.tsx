import React from 'react';

export type entryFileMeta = {
    name: string,
    success: number,
    failed: number,
    empty: number
  }

export class EntryFilesListItem extends React.Component<entryFileMeta, {}, any> {
  render () {
    if (this.props.failed > 0) {
      return <li>{this.props.name} (Found: {this.props.success}, Failed: {this.props.failed})</li>
    }
    return (
      <li>{this.props.name} (Found: {this.props.success})</li>
    )

  }
}