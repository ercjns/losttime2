import React from 'react';
import { ltEvent } from '../../lt/Event';
import { BasicDz } from '../dz';
import { PageTitle } from '../PageTitle';
import { RaceDetailsForm } from './RaceDetailsForm';

type resultsprocessingstate = {
    event: ltEvent|null
    isProcessing: boolean
  }

export class ResultsProcessor extends React.Component<{}, resultsprocessingstate, {}> {

    constructor(props:{}) {
        super(props);
        this.state = {
            event: null,
            isProcessing: false
        }
    }

    loadNewResults = (file:File) => {
        console.log(file.name);
        this.setState({isProcessing:true})
        var formData = new FormData();
        formData.append('file', file);
        
        fetch('/api/race', {
            method: 'POST',
            body: formData})
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            this.setState({event:result.event, isProcessing:false});
        });
    }

    render () {
        if (this.state.event === null && !this.state.isProcessing) {
            return (<div>
                <PageTitle 
                    title="Process Results Files" 
                />
                <p>
                    Save event results using the IOF XML v3 format. Upload here, then follow the prompts to set scoring methods.
                </p>
                <div>
                <h4>Files</h4>
                <p>
                    <BasicDz parser={this.loadNewResults} helpText="Drop xml file here or click to open file browser."/>
                </p>
                </div>
            </div>)
        } else if (this.state.event !== null) {
            return (<div>
                <PageTitle 
                    title="Process Results Files" 
                />
                <div>
                <RaceDetailsForm event={this.state.event}/>
                </div>
            </div>)
        } else {
            return(<div>
                <h4>Processing...</h4>
                <p>Please be patient, this can take a minute or two.</p>
                </div>)
        }
    }
}