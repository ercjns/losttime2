import React from 'react';
import { BasicDz } from '../dz';
import { PageTitle } from '../PageTitle';

export class ResultsProcessor extends React.Component<{}, {}, {}> {

    loadNewResults(file:File) {
        console.log(file.name);
        var formData = new FormData();
        formData.append('file', file);
        
        fetch('/api/race', {
            method: 'POST',
            body: formData})
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
        });
    }

    render () {
    return (
        <div>
            <PageTitle 
                title="Process Results Files" 
            />
            <p>
                Save event results using the IOF XML v3 format. Upload here, then follow the prompts to set scoring methods.
            </p>
            <h4>Files</h4>
            <p>
                <BasicDz parser={this.loadNewResults} helpText="Drop xml file here or click to open file browser."/>
            </p>
        </div>
    );
    }
}