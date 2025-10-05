import React, {Component} from 'react';
import Dropzone from 'react-dropzone';

export class BasicDz extends Component<{parser:any, helpText:String}, {files:File[]}, {}> {
  onDrop: (files: File[]) => void;
  constructor(props:{parser:any, helpText:String}) {
    super(props);
    this.onDrop = (files) => {
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            this.props.parser(files[i]);
        };
      this.setState({files})
    };
    this.state = {
      files: []
    };
  }

  baseStyle:any = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column', // hack fix https://github.com/cssinjs/jss/issues/1344
    alignItems: 'center',
    padding: '20px',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#0d6efd',
    borderStyle: 'dotted',
    backgroundColor: 'white',
    color: '#0d6efd',
    fontStyle: 'italic',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

  activeStyle:any = {
    borderColor: '#2196f3'
  };
  
  acceptStyle:any = {
    borderColor: '#00e676'
  };
  
  rejectStyle:any = {
    borderColor: '#ff1744'
  };

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({
                className: 'dropzone',
                style: this.baseStyle,
                   })}>
              <input id="dz-file-input" {...getInputProps()} />
              <p>{this.props.helpText}</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}