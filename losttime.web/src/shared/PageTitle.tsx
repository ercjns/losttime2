import React from 'react';

export class PageTitle extends React.Component<{title: string}, {}, {}> {

  render () {
  return (
    <div>
    <h1 style={{

    }}>
        {this.props.title}
    </h1>
    <div style={{
        width: '100%',
        height: '2px',
        backgroundColor: 'magenta',
        marginTop: '10px',
        marginBottom: '10px'
    }}>
    </div>
    </div>
  );
  }

}