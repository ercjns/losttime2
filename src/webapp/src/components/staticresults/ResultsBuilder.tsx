import React from 'react';
import { PageTitle } from '../PageTitle';
import { BasicDz } from '../dz';
import { X2jOptionsOptional, XMLParser } from 'fast-xml-parser';
import { SplitsByClassXml, splitsByClassXmlMeta } from './SplitsByClassXml';
import { LtStaticClassResult, parseRaceResult, RaceClassListItem} from './RaceResult';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';

type resultsBuilderState = {
  filesprocessed: splitsByClassXmlMeta[],
  races: number,
  raceData: LtStaticClassResult[]
  competitionClasses: number
}

export class ResultsBuilder extends React.Component<{}, resultsBuilderState, {}> {

  constructor(props: {}) {
    super(props);
    this.state = {
      filesprocessed: [],
      races: 0,
      raceData: [],
      competitionClasses: 0
    };

    this.updateRaceResults = this.updateRaceResults.bind(this);
  }

  async updateRaceResults(file: File) {
    const parserOptions: X2jOptionsOptional = {
      ignoreAttributes: false,
    }
    const parser = new XMLParser(parserOptions);
    const resultsObj = parser.parse(await file.text());
    console.log(resultsObj)

    const newfile: splitsByClassXmlMeta = {
      name: file.name,
      raceClasses: resultsObj.ResultList.ClassResult.length
    };
    
    this.setState({
      races: this.state.races+1,
      raceData: parseRaceResult(resultsObj.ResultList).ClassResults,
      filesprocessed: [...this.state.filesprocessed, newfile]
    });
  }

  render() {

    const fileInfo = this.state.filesprocessed.map((filemeta) =>
      <SplitsByClassXml
        name={filemeta.name}
        raceClasses={filemeta.raceClasses}
      />
    );

    const raceClassList = this.state.raceData.map((raceclassresult) =>
      <RaceClassListItem
        raceClassName={raceclassresult.Class.Name}
        resultsCount={raceclassresult.PersonResult.length || 0 }
      />
      )
    const raceClassTable = 
      <div>
        <h6>Event Name Goes here</h6>
        <table>
          <tr>
            <th>Event Name</th>
            <th>Next Event Name</th>
          </tr>
          <tr>
            <td>Class 1 (13 results)</td>
          </tr>
          <tr>
            <td>Class 2 (14 results)</td>
            <td>Class 2 (17 results)</td>
          </tr>
          <tr>
            <td>Class 3 (9 results)</td>
            <td>Class 3 (27 results)</td>
          </tr>
          <tr>
            <td>Class 4 (40 results)</td>
            <td>Class 4 (35 results)</td>
          </tr>
        </table>
      </div>;

    return (
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
            <BasicDz parser={this.updateRaceResults} helpText="Drop xml file here or click to open file browser." />
          </p>
        </div>
        
        <div>
          {fileInfo}
        </div>
          <ul>
            {raceClassList}
          </ul>
        <div> 
          Select one or more race classes above, then click the button below to create a competition class that considers the results of the selected race classes.
        </div>

        <Row>
          <ButtonToolbar>
            <ButtonGroup>
              <Button variant="primary">Create Compeition Class</Button>
            </ButtonGroup>
            <ButtonGroup className="me-2">
              <DropdownButton title="Use a template"
                variant="outline-primary">
                <Dropdown.Item>One Per Race Class</Dropdown.Item>
                <Dropdown.Item>COC: Winter 23-24</Dropdown.Item>
                <Dropdown.Item>COC: Ultimate O 2024</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </ButtonToolbar>
          <Row>
          <h4>Define Competition Classes</h4>
          <p>
            A competition class represents a class for which results can be ranked. It could be individuals, teams, a multi-day event, or a series. <br />
            The <b>competition class score method</b> indicates how to score and rank all race results added to the class .<br />
            The <b>race class score method</b> is optional. It is used if race results from an individual race class must be scored before scoring/ranking the competition class. Most common for multi-day results or team results.<br />
          </p>
        </Row>
          <div>
            <Form>
              <Form.Group>
                <Form.Label>Competition Class Name</Form.Label>
                <Form.Control size="lg" type="text" placeholder="W1M" />
              </Form.Group>

              Class 1 (Event Name), Class 1 (Next Event Name)

              <Form.Group>
                <Form.Label>Competition Class Type</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Single Race - Individuals</option>
                  <option>Single Race - Teams</option>
                  <option>Multiple Races - Individuals</option>
                  <option>Multiple Races - Teams</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Scoring Method - Individuals</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Time: No Additional Points/Scores</option>
                  <option>1000pts Ratio to Winner / Scottish</option>
                  <option>COC Winter League (100,95,92,91,...)</option>
                  <option>OUSA Scholastic Average Winning Time points</option>
                  <option>Alpha: Remove times and status. List participants</option>
                </Form.Select>
                <Form.Text>Single-I, Single-T, Multi-I, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Scoring Method - Multiple Events</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Sum All</option>
                  <option>Sum Best N, tiebreak all</option>
                  <option>Sum Best N, tiebreak using N only</option>
                </Form.Select>
                <Form.Text>Muli-I, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Multiple Events: Minimum races</Form.Label>
                <Form.Control type="number" placeholder="1" />
                <Form.Text>Multi-I, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Multiple Events: Use Best N</Form.Label>
                <Form.Control type="number" placeholder="4" />
                <Form.Text>Multi-I, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Collation for Team competition class</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Create a new combined race class for all individuals at each race. - only one 1st place per race. (Default)</option>
                  <option>Score each race class individually, then combine into teams. - one 1st place per race class. (COC WL MS)</option>
                </Form.Select>
                <Form.Text>Single-T, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Minimum team size</Form.Label>
                <Form.Control type="number" placeholder="2" />
              </Form.Group>
              <Form.Text>Single-T, Multi-T</Form.Text>
              <Form.Group>
                <Form.Label>Maximum team size</Form.Label>
                <Form.Control type="number" placeholder="3" />
                <Form.Text>Single-T, Multi-T</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Scoring Method - Teams</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Sum all, highest wins</option>
                  <option>Sum all, lowest wins</option>
                </Form.Select>
                <Form.Text>Single-T, Multi-T</Form.Text>
              </Form.Group>
            </Form>
          </div>
        </Row>
        <Row>
          <h4>Download Results</h4>
          <ButtonGroup className="me-2">
              <DropdownButton title="Download Results"
                variant="outline-primary">
                <Dropdown.Item>Plaintext</Dropdown.Item>
                <Dropdown.Item>Generic HTML</Dropdown.Item>
                <Dropdown.Item>COC HTML</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
        </Row>
      </div>
    )
  }
}