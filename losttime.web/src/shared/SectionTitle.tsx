import React from 'react';

export class SectionTitle extends React.Component<{title: string, line:boolean}, {}, {}> {

  render () {
    const linediv = (this.props.line) ?
      <div style={{
        width: '100%',
        height: '2px',
        backgroundColor: 'magenta',
        marginTop: '10px',
        marginBottom: '10px'
        }}></div>
        :
      <div></div>;

  return (
    <div>
    <h3>
        {this.props.title}
    </h3>
    {linediv}
    </div>
  );
  }

}