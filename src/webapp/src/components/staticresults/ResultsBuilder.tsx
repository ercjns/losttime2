import React, { FormEvent } from 'react';
import { PageTitle } from '../PageTitle';
import { BasicDz } from '../dz';
import { X2jOptionsOptional, XMLParser } from 'fast-xml-parser';
import { SplitsByClassXml, splitsByClassXmlMeta } from './SplitsByClassXml';
import { LtStaticRaceClassResult, parseRaceResult} from './RaceResult';
import { Button, ButtonGroup, ButtonToolbar, Collapse, Dropdown, DropdownButton, Form, Row, Table } from 'react-bootstrap';
import { CompetitionClass, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from './CompetitionClass';
import { createCompClassDocument_CascadeOc, createCompHeaderDocument_CascadeOc } from './outputstyles/style_cascadeoc';
import { createCompClassDocument_plaintext } from './outputstyles/style_plaintext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/matchers';


enum resultsOutputStyle {
  plaintext = 0,
  genericHtml,
  cascadeocHtml
}

enum CompClassType {
  OneRaceIndv,
  OneRaceTeam,
  ManyRaceIndv,
  ManyRaceTeam
}

type resultsBuilderState = {
  filesprocessed: splitsByClassXmlMeta[],
  races: number,
  raceData: LtStaticRaceClassResult[]
  competitionClasses: CompetitionClass[],
  raceDataToggleOpen: boolean,
  advancedCompetitionClassDefinitionOpen: boolean,
  competitionDataToggleOpen: boolean,
  compClassForm_selectedRaceClasses: string[],
  compClassForm_name?: string,
  compClassForm_type: CompClassType,
  compClassForm_indvScoreMethod: IndividualScoreMethod,
  compClassForm_teamCollation: TeamCollationMethod,
  compClassForm_teamSizeMin: number,
  compClassForm_teamSizeMax: number,
  compClassForm_teamScoreMethod: TeamScoreMethod,
  outputStyle: resultsOutputStyle
}

export class ResultsBuilder extends React.Component<{}, resultsBuilderState, {}> {

  constructor(props: {}) {
    super(props);
    this.state = {
      filesprocessed: [],
      races: 0,
      raceData: [],
      competitionClasses: [],
      raceDataToggleOpen: true,
      advancedCompetitionClassDefinitionOpen: false,
      competitionDataToggleOpen: false,
      compClassForm_selectedRaceClasses: [],
      compClassForm_name: undefined,
      compClassForm_type: CompClassType.OneRaceIndv,
      compClassForm_indvScoreMethod: IndividualScoreMethod.Time,
      compClassForm_teamCollation: TeamCollationMethod.ScoreThenCombine,
      compClassForm_teamSizeMin: 2,
      compClassForm_teamSizeMax: 3,
      compClassForm_teamScoreMethod: TeamScoreMethod.SumAllHighestWins,
      outputStyle: resultsOutputStyle.cascadeocHtml
    };

    this.updateRaceResults = this.updateRaceResults.bind(this);
    this.myToggler1 = this.myToggler1.bind(this);
    this.myToggler2 = this.myToggler2.bind(this);
    this.createHtml = this.createHtml.bind(this);
    this.handleSelectedRaceClass = this.handleSelectedRaceClass.bind(this);
    this.handleCompClassTypeChange = this.handleCompClassTypeChange.bind(this);
    this.handleCompClassNameChange = this.handleCompClassNameChange.bind(this);
    this.handleCompClassScoreMethodIndvChange = this.handleCompClassScoreMethodIndvChange.bind(this);
    this.handleCompClassTeamCollationChange = this.handleCompClassTeamCollationChange.bind(this);
    this.handleCompClassTeamSizeMinChange = this.handleCompClassTeamSizeMinChange.bind(this);
    this.handleCompClassTeamSizeMaxChange = this.handleCompClassTeamSizeMaxChange.bind(this);
    this.handleCompClassTeamScoreMethodChange = this.handleCompClassTeamScoreMethodChange.bind(this)
    this.addSingleCompetitionClass = this.addSingleCompetitionClass.bind(this);
  }

  async updateRaceResults(file: File) {
    const parserOptions: X2jOptionsOptional = {
      ignoreAttributes: false,
    }
    const parser = new XMLParser(parserOptions);
    const resultsObj = parser.parse(await file.text());

    try {
      const newfile: splitsByClassXmlMeta = {
        name: file.name,
        raceClasses: resultsObj.ResultList.ClassResult.length
      };

      this.setState({
        races: this.state.races+1,
        raceData: parseRaceResult(resultsObj.ResultList).ClassResults,
        filesprocessed: [...this.state.filesprocessed, newfile]
      });

    } catch (error) {
      alert("Couldn't parse that file. This should be an Orienteering XML <ResultList>.");
    }
  }

  myToggler1() {
    this.setState({
      competitionDataToggleOpen: !this.state.competitionDataToggleOpen
    })
  }

  myToggler2() {
    this.setState({
      advancedCompetitionClassDefinitionOpen: !this.state.advancedCompetitionClassDefinitionOpen
    })
  }

  getRaceClassById(id:string) {
    return this.state.raceData.find((x) => x.ID.toString() === id);
  }

  handleSelectedRaceClass(e:React.MouseEvent<HTMLInputElement, MouseEvent>) {
    console.log(e.currentTarget.id, e.currentTarget.checked);
    
    if (e.currentTarget.checked) {
      if (!this.state.compClassForm_name) {
        this.setState({
          compClassForm_name: this.getRaceClassById(e.currentTarget.id)?.Class.Name
        })
      }
      this.setState({
        compClassForm_selectedRaceClasses: [...this.state.compClassForm_selectedRaceClasses, e.currentTarget.id],
      })
    } else if (!e.currentTarget.checked) {
      const index = this.state.compClassForm_selectedRaceClasses.indexOf(e.currentTarget.id);
      if (index > -1) {

        let newArray = this.state.compClassForm_selectedRaceClasses;
        newArray.splice(index, 1);
        this.setState({
          compClassForm_selectedRaceClasses: newArray
        })
        if (newArray.length === 0) {
          this.setState({
            compClassForm_name: ""
          })
        }
      }
    }
  }

  handleCompClassNameChange(e:any) {
    this.setState({compClassForm_name: e.target.value});
  }

  handleCompClassTypeChange(e:any) {
    this.setState({compClassForm_type: parseInt(e.target.value)});
  }

  handleCompClassScoreMethodIndvChange(e:any) {
    this.setState({compClassForm_indvScoreMethod: parseInt(e.target.value)});
  }

  handleCompClassTeamCollationChange(e:any) {
    this.setState({compClassForm_teamCollation: parseInt(e.target.value)});
  }

  handleCompClassTeamSizeMinChange(e:any) {
    this.setState({compClassForm_teamSizeMin: e.target.value});
  }

  handleCompClassTeamSizeMaxChange(e:any) {
    this.setState({compClassForm_teamSizeMax: e.target.value});
  }

  handleCompClassTeamScoreMethodChange(e:any) {
    this.setState({compClassForm_teamScoreMethod: parseInt(e.target.value)});
  }

  handleRemoveCompClass(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const sliceIndex = (e.currentTarget.id).indexOf("-") + 1;
    const toRemove = (e.currentTarget.id).slice(sliceIndex);
    const index = this.state.competitionClasses.findIndex((x) => x.ID.toString() === toRemove);
    if (index > -1) {
      let newArray = this.state.competitionClasses;
      newArray.splice(index, 1);
      this.setState({
        competitionClasses: newArray
      })
    }
  }

  private getRaceDataForSelectedRaceClasses():LtStaticRaceClassResult[] {
    let raceData:LtStaticRaceClassResult[] = [];
    for (const raceClassId of this.state.compClassForm_selectedRaceClasses) {
      const data:LtStaticRaceClassResult|undefined = this.state.raceData.find(x => x.ID.toString() === raceClassId);
      if (data && data.PersonResults.length > 0) {
        raceData.push(data);
      }
    }
    return raceData;
  }
  
  addSingleCompetitionClass(event:FormEvent) {
    event.preventDefault();

    // validate we've got everything we need
    if (!this.state.compClassForm_name) {alert("no name"); return;}

    // create the new competition class
    let newCompClass = new CompetitionClass();

    // fill fields
    newCompClass.Name = this.state.compClassForm_name

    switch (this.state.compClassForm_type as CompClassType) {
      case CompClassType.OneRaceIndv:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = false;
        break;
      case CompClassType.OneRaceTeam:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = true;
        newCompClass.ScoreMethod_Team = new TeamScoreMethodDefinition(
          this.state.compClassForm_teamScoreMethod,
          this.state.compClassForm_teamSizeMin,
          this.state.compClassForm_teamSizeMax,
          this.state.compClassForm_teamCollation
        );
        break;
      case CompClassType.ManyRaceIndv:
        newCompClass.IsMultiRace = true;
        newCompClass.IsTeamClass = false;
        break;
      case CompClassType.ManyRaceTeam:
        newCompClass.IsMultiRace = true;
        newCompClass.IsTeamClass = true;
        break;
    }

    newCompClass.RaceResults = this.getRaceDataForSelectedRaceClasses();
    newCompClass.ScoreMethod = this.state.compClassForm_indvScoreMethod;

    // score it!
    newCompClass.computeScores();

    // add it to the competition!
    this.setState(
      {competitionClasses: [...this.state.competitionClasses, newCompClass]}
    )
    return;
  }

  createHtml() {
    let doc = ""

    // add things to the doc based on the style requested
    switch (this.state.outputStyle) {
      case resultsOutputStyle.plaintext:
        doc += "Title goes here"
        doc += "\r\n"
        doc += "\r\n"
        break;
      case resultsOutputStyle.genericHtml:
      case resultsOutputStyle.cascadeocHtml:
        doc += createCompHeaderDocument_CascadeOc(this.state.competitionClasses);
        break;
    }

    for (const x of this.state.competitionClasses) {
      switch (this.state.outputStyle) {
        case resultsOutputStyle.plaintext:
          doc += x.Name;
          doc += "\r\n";
          doc += createCompClassDocument_plaintext(x);
          break;
        case resultsOutputStyle.genericHtml:
        case resultsOutputStyle.cascadeocHtml:
          doc += createCompClassDocument_CascadeOc(x)
      }

    }


    this.downloadFile(doc)
  }

  // https://www.youtube.com/watch?v=io2blfAlO6E
  downloadFile(data:any, name = "file.txt") {
    const blob = new Blob([data], {type:"octet-stream"});
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href,
      style: "display-none",
      download: name
    });
    document.body.appendChild(a);

    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  }

  render() {

    const fileInfo = this.state.filesprocessed.map((filemeta) =>
      <SplitsByClassXml
        name={filemeta.name}
        raceClasses={filemeta.raceClasses}
      />
    );

    const raceClassCheckboxList = this.state.raceData.map((raceclassresult) =>
      <Form.Check
        key={raceclassresult.ID.toString()}
        type="checkbox" 
        id={raceclassresult.ID.toString()}
        label={raceclassresult.Class.Name + " (" + (raceclassresult.PersonResults.length ?? "0") + " records)"}
        onClick={(e) => this.handleSelectedRaceClass(e)}
      /> 
      )

      const configuredCompetitionClasses = this.state.competitionClasses.map((compclass) =>
      <li key={compclass.ID.toString()}>
        <b>Name:</b> {compclass.Name} 
        &nbsp;<b>Scoring:</b> {IndividualScoreMethod[compclass.ScoreMethod]} 
        &nbsp;<Button
          // onClick={(e) => this.handleRemoveCompClass(e)}
          id={"up-" + compclass.ID.toString()}
          variant="outline-secondary"
          size="sm"
          disabled
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
        &nbsp;<Button
          // onClick={(e) => this.handleRemoveCompClass(e)}
          id={"down-" + compclass.ID.toString()}
          variant="outline-secondary"
          size="sm"
          disabled
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
        &nbsp;<Button
          onClick={(e) => this.handleRemoveCompClass(e)}
          id={"remove-" + compclass.ID.toString()}
          variant="outline-danger"
          size="sm"
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>

      </li>
    )


    return (
      <div>
        <PageTitle
          title="Create Competition Results"
        />
        <p>
          LostTime no longer saves any of your work, such as previous results to combine into a series. This greatly simplifies our ability to provide updates to the service. What this means is that you're always working on only ONE <b>competition</b> at a given time. A competition could be a single race, a multi-race event, or a series. LostTime still handles all these scenarios, but for multi-race competitions, you'll need to keep track of historic race files on our own, and re-load them each time you need to update with new results.
        </p>
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
        <hr />
        <div>
          <p>
            After loading relevant race results, most users should&nbsp;
            <ButtonGroup className="me-2" size="sm">
              <Button size="sm">click here</Button>
              <DropdownButton as={ButtonGroup} size="sm" title="">
                <Dropdown.Item>Standard: One Per Race Class</Dropdown.Item>
                <Dropdown.Item>COC: Winter 23-24</Dropdown.Item>
                <Dropdown.Item>COC: Ultimate O 2024</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
            to create one competition class for each race class, or use a pre-defined template if one has been created for your events. You'll still be able to add competition classes (such as teams) using the <Button size="sm" variant="link" onClick={this.myToggler2}>advanced tools</Button> or remove classes that shouldn't be included.
          </p>
          <Collapse in={this.state.advancedCompetitionClassDefinitionOpen}><div>
          <p>
            <b>Need something more custom?</b> Select one or more race classes below, then click "create competition class" to make a class that considers the results of the selected race classes. Repeat for each competition class. Regular user with repeat event or series needs? Ask for a template to generate many competition classes at once.
          </p>
          <Row>
            <div>
              <ButtonToolbar>
              <ButtonGroup>
                  <Button variant="primary" disabled>Create Compeition Class</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </div>
          </Row>

          <Row>
            <div>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>Class</th>
                <th>Race 1: Winter League 1</th>
                <th>Race 2: Winter League 2</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>1 <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 4 results</td>
              <td><input type="checkbox" /> 4 results</td>
            </tr>
            <tr>
              <td>3 <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 10 results</td>
              <td><input type="checkbox" /> 10 results</td>
            </tr>
            <tr>
              <td>4 <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 6 results</td>
              <td><input type="checkbox" /> 6 results</td>
            </tr>
            <tr>
              <td>7F <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 23 results</td>
              <td><input type="checkbox" /> 23 results</td>
            </tr>
            <tr>
              <td>7G <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 2 results</td>
              <td><input type="checkbox" /> 2 results</td>
            </tr>
            <tr>
              <td>7O <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 41 results</td>
              <td><input type="checkbox" /> 41 results</td>
            </tr>
            <tr>
              <td>8F <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 29 results</td>
              <td><input type="checkbox" /> 29 results</td>
            </tr>
            <tr>
              <td>8G <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 4 results</td>
              <td><input type="checkbox" /> 4 results</td>
            </tr>
            <tr>
              <td>8O <Button variant="link" size="sm">select across</Button></td>
              <td><input type="checkbox" /> 53 results</td>
              <td><input type="checkbox" /> 53 results</td>
            </tr>
            </tbody>
          </Table>
            </div>
          </Row>
          </div></Collapse>
        </div>






        <div>
          <Form onSubmit={this.addSingleCompetitionClass}>
            {raceClassCheckboxList}

            Selected Classes: //TODO

            <Form.Group>
              <Form.Label>Competition Class Name</Form.Label>
              <Form.Control 
                type="text"
                value={this.state.compClassForm_name}
                onChange={this.handleCompClassNameChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Competition Class Type</Form.Label>
              <Form.Select id='Comp-Class-Type-Select'
                  value={this.state.compClassForm_type}
                  onChange={this.handleCompClassTypeChange}
              >
                <option value={CompClassType.OneRaceIndv}>Single Race - Individuals</option>
                <option value={CompClassType.OneRaceTeam}>Single Race - Teams</option>
                {/* <option value={CompClassType.ManyRaceIndv}>Multiple Races - Individuals</option> */}
                {/* <option value={CompClassType.ManyRaceTeam}>Multiple Races - Teams</option> */}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Scoring Method - Individuals</Form.Label>
              <Form.Select id='Comp-Class-Select-ScoreMethod-Single-Indv'
                  value={this.state.compClassForm_indvScoreMethod}
                  onChange={this.handleCompClassScoreMethodIndvChange}
              >
                <option value={IndividualScoreMethod.Time}>Time: No Additional Points/Scores</option>
                {/* <option value={IndividualScoreMethod.Points1kScottish}>1000pts Ratio to Winner / Scottish</option> */}
                <option value={IndividualScoreMethod.PointsCocWorldCup}>COC Winter League (100,95,92,90,...)</option>
                {/* <option value={IndividualScoreMethod.PointsOusaAverageWinningTime}>OUSA Scholastic Average Winning Time points</option> */}
                {/* <option value={IndividualScoreMethod.AlphaWithoutTimes}>Alpha: Remove times and status. List participants</option> */}
              </Form.Select>
            </Form.Group>

            //TODO: only show the team stuff if a team class type is selected.

            <Form.Group>
              <Form.Label>Collation for Team competition class</Form.Label>
              <Form.Select id='comp-class-select-ScoreMethod-team-collation'
                  value={this.state.compClassForm_teamCollation}
                  onChange={this.handleCompClassTeamCollationChange}>
                <option value={TeamCollationMethod.ScoreThenCombine}>Score each race class individually, then combine into teams. (A team can have multiple people who each got 1st place in different classes.)</option>
                <option value={TeamCollationMethod.CombineThenScore}>Create a new combined race class for all individuals at each race.</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Minimum team size</Form.Label>
              <Form.Control type="number" value={this.state.compClassForm_teamSizeMin} onChange={this.handleCompClassTeamSizeMinChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Maximum team size</Form.Label>
              <Form.Control type="number" value={this.state.compClassForm_teamSizeMax} onChange={this.handleCompClassTeamSizeMaxChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Scoring Method - Teams</Form.Label>
              <Form.Select
                id='comp-class-select-team-scoremethod'
                value={this.state.compClassForm_teamScoreMethod}
                onChange={this.handleCompClassTeamScoreMethodChange}>
                <option value={TeamScoreMethod.SumAllHighestWins}>Sum all, highest wins</option>
                <option value={TeamScoreMethod.SumAllLowestWins}>Sum all, lowest wins</option>
              </Form.Select>
            </Form.Group>

              {/* <Form.Group>
                <Form.Label>Scoring Method - Multiple Events</Form.Label>
                <Form.Select>
                  <option></option>
                  <option>Sum All</option>
                  <option>Sum Best N, tiebreak all</option>
                  <option>Sum Best N, tiebreak using N only</option>
                </Form.Select>
                <Form.Text>Muli-I, Multi-T</Form.Text>
              </Form.Group> */}
              {/* <Form.Group>
                <Form.Label>Multiple Events: Minimum races</Form.Label>
                <Form.Control type="number" placeholder="1" />
                <Form.Text>Multi-I, Multi-T</Form.Text>
              </Form.Group> */}
              {/* <Form.Group>
                <Form.Label>Multiple Events: Use Best N</Form.Label>
                <Form.Control type="number" placeholder="4" />
                <Form.Text>Multi-I, Multi-T</Form.Text>
              </Form.Group> */}

            <Button type="submit">Create Compeition Class</Button>
          </Form>

        </div>

        
        <hr />

        <Row>
          <h4>Review Competition Classes</h4>
          <p>
            These competition classes have been defined and will be included in output.
          </p>
          <p>
            <ul>
            {configuredCompetitionClasses}
            </ul>
          </p>

          <p>
          {/* <Button size="sm" onClick={this.createHtml}>
            Download Compeition Results
          </Button> */}
          </p>
          <h4>Download Results</h4>
          <ButtonGroup className="me-2">
              <DropdownButton title="Download Results"
                variant="outline-primary">
                <Dropdown.Item>Plaintext</Dropdown.Item>
                <Dropdown.Item>Generic HTML</Dropdown.Item>
                <Dropdown.Item onClick={this.createHtml}>COC HTML</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
        </Row>
      </div>
    )
  }
}