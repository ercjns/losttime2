import React from 'react';
import { PageTitle } from '../PageTitle';
import { BasicDz } from '../dz';
import { X2jOptionsOptional, XMLParser } from 'fast-xml-parser';
import { SplitsByClassXml, splitsByClassXmlMeta } from './SplitsByClassXml';

type resultsBuilderState = {
    filesprocessed: splitsByClassXmlMeta[],
    races: number,
    competitionClasses: number
}

export class ResultsBuilder extends React.Component<{}, resultsBuilderState, {}> {

    constructor(props:{}) {
        super(props);
        this.state = {
            filesprocessed: [],
            races: 0,
            competitionClasses: 0
        };

    this.updateRaceResults = this.updateRaceResults.bind(this);
    }

    async updateRaceResults(file:File) {
        
        const alwaysArray = [
            "root.ClassResult",
            "root.ClassResult.PersonResult",
            "root.ClassResult.PersonResult.Result"
        ]
        const parserOptions:X2jOptionsOptional = {
            ignoreAttributes: false,
            isArray: (name:string, jpath:string, isLeafNode:boolean, isAttribute:boolean) => {
                if( alwaysArray.indexOf(jpath) !== -1) return true;
                return false;
            }
        }

        const parser = new XMLParser(parserOptions);
        const resultsObj = parser.parse(await file.text());
        console.log(resultsObj)
        const newfile:splitsByClassXmlMeta = {
            name: file.name,
            success: resultsObj.ResultList.ClassResult.length
        };
        
        this.setState({
            filesprocessed: [...this.state.filesprocessed, newfile]
        });
    }

    render () {

        const races = this.state.filesprocessed.map((filemeta) =>
            <SplitsByClassXml
                name={filemeta.name}
                success={filemeta.success}
            />
        );

        return(
            <div>
                <PageTitle 
                    title="Create Results" 
                />
                <p>In the static version, there is always only one Competition</p>
                <ol>
                    <li>Add race(s) by uploading race results</li>
                    <li>Define Competition Classes using Race Classes and available Score Methods</li>
                    <li>Select the desired outputs</li>
                </ol>
                <div>
                <h4>Add Race Results</h4>
                <p>
                    <BasicDz parser={this.updateRaceResults} helpText="Drop xml file here or click to open file browser."/>
                </p>
                </div>
                <div>
                    {races}
                </div>
            </div>
        )
    }
}