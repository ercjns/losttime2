import React, { FormEvent } from 'react';
import { PageTitle } from '../shared/PageTitle';
import { BasicDz } from '../shared/dz';
import { X2jOptionsOptional, XMLParser } from 'fast-xml-parser';
import { RaceFileListItem, RaceFileListItemProps } from './RaceFileListItem';
import { LtStaticRaceClassResult, parseRaceResult} from './RaceResult';
import { Button, ButtonGroup, Collapse, Dropdown, DropdownButton, Form, Row} from 'react-bootstrap';
import { CompetitionClass, CompetitionClassType, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from './CompetitionClass';
import { createOutputDoc_CascadeOc } from './outputstyles/style_cascadeoc';
import { createOutputDoc_JN2024 } from './outputstyles/style_jn2024';
// import { createCompClassDocument_plaintext } from './outputstyles/style_plaintext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { CompetitionClassPreset } from './competitionpresets/CompetitionPreset';
import { Guid } from 'guid-typescript';
import { JNTesting } from './competitionpresets/preset_JNtesting';
import { CocWinterLeauge } from './competitionpresets/preset_cascadeoc';
import { JN1Friday } from './competitionpresets/JN2024_1Fri_CompClasses';
import { JN2Saturday } from './competitionpresets/JN2024_2Sat_CompClasses';
import { JN3Sunday } from './competitionpresets/JN2024_3Sun_CompClasses';
import { JN4twoday } from './competitionpresets/JN2024_4twoday_CompClasses';
import { createOutputDoc_JN2024live } from './outputstyles/style_jn2024live';


enum resultsOutputStyle {
  plaintext = 0,
  genericHtml,
  cascadeocHtml,
  jn2024Html,
  jn2024LiveHtml
}

type resultsBuilderState = {
  filesprocessed: RaceFileListItemProps[],
  races: number,
  raceData: LtStaticRaceClassResult[]
  competitionClasses: CompetitionClass[],
  raceDataToggleOpen: boolean,
  advancedCompetitionClassDefinitionOpen: boolean,
  competitionDataToggleOpen: boolean,
  compClassForm_selectedRaceClasses: string[],
  compClassForm_name?: string,
  compClassForm_type: CompetitionClassType,
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
      compClassForm_type: CompetitionClassType.OneRaceIndv,
      compClassForm_indvScoreMethod: IndividualScoreMethod.Time,
      compClassForm_teamCollation: TeamCollationMethod.ScoreThenCombine,
      compClassForm_teamSizeMin: 2,
      compClassForm_teamSizeMax: 3,
      compClassForm_teamScoreMethod: TeamScoreMethod.SumAllHighestWins,
      outputStyle: resultsOutputStyle.jn2024LiveHtml
    };

    this.updateRaceResults = this.updateRaceResults.bind(this);
    this.myToggler1 = this.myToggler1.bind(this);
    this.myToggler2 = this.myToggler2.bind(this);
    this.createOutputDoc = this.createOutputDoc.bind(this);
    this.handleSelectedRaceClass = this.handleSelectedRaceClass.bind(this);
    this.handleCompClassTypeChange = this.handleCompClassTypeChange.bind(this);
    this.handleCompClassNameChange = this.handleCompClassNameChange.bind(this);
    this.handleCompClassScoreMethodIndvChange = this.handleCompClassScoreMethodIndvChange.bind(this);
    this.handleCompClassTeamCollationChange = this.handleCompClassTeamCollationChange.bind(this);
    this.handleCompClassTeamSizeMinChange = this.handleCompClassTeamSizeMinChange.bind(this);
    this.handleCompClassTeamSizeMaxChange = this.handleCompClassTeamSizeMaxChange.bind(this);
    this.handleCompClassTeamScoreMethodChange = this.handleCompClassTeamScoreMethodChange.bind(this)
    this.addSingleCompetitionClass = this.addSingleCompetitionClass.bind(this);
    this.loadPreset = this.loadPreset.bind(this);
  }

  async updateRaceResults(file: File) {
    const parserOptions: X2jOptionsOptional = {
      ignoreAttributes: false,
    }
    const parser = new XMLParser(parserOptions);
    const resultsObj = parser.parse(await file.text());

    try {
      const newfile: RaceFileListItemProps = {
        name: file.name,
        raceClasses: resultsObj.ResultList.ClassResult.length,
      };

      this.setState({
        races: this.state.races+1,
        raceData: [...this.state.raceData, parseRaceResult(resultsObj.ResultList, this.state.races+1).ClassResults].flat(),
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

  private getRaceClassResultsFromClassCodes(classCodes:string[]): LtStaticRaceClassResult[] {
    // takes a set of class codes like ["W2F", "W2M"]
    // returns all the LtStaticRaceClassResults in a flat list.
    let results:LtStaticRaceClassResult[] = [];
    for (const raceClassId of classCodes.flatMap(x =>
      this.getRaceClassesByClassCode(x))) {
      const data = this.getRaceDataForRaceClassById(raceClassId)
      if (data && data.PersonResults.length > 0) {
        results.push(data);
      }
    }
    return results;
  }

  private getRaceClassesByClassCode(classCode:string):string[] {
    // takes a string class code like "W2F" or "1"
    // returns an array of IDs for all race classes with that exaxtly match that class code.
    // Class codes that are integers only are stored as numbers, so call toString() on
    // the shortName to find them.
    let matches = this.state.raceData.filter((x) => x.Class.ShortName?.toString() === classCode);
    return matches.map(x => x.ID.toString());
  }

  private getRaceDataForRaceClassById(raceClassId:string):LtStaticRaceClassResult|undefined {
    const data:LtStaticRaceClassResult|undefined = this.state.raceData.find(x => x.ID.toString() === raceClassId);
    if (data && data.PersonResults.length > 0) {
      return data;
    }
    return;
  }

  private getRaceDataForSelectedRaceClasses():LtStaticRaceClassResult[] {
    let raceData:LtStaticRaceClassResult[] = [];
    for (const raceClassId of this.state.compClassForm_selectedRaceClasses) {
      const data = this.getRaceDataForRaceClassById(raceClassId)
      if (data && data.PersonResults.length > 0) {
        raceData.push(data);
      }
    }
    return raceData;
  }

  loadPreset(presetName:string) {
    if (presetName === 'COCWL2324') {
      CocWinterLeauge.Classes.forEach(preset =>
      this.addSingleCompetitionClassFromPreset(preset));  
    } else if (presetName === 'COCWL2324_JNTEST') {
      JNTesting.Classes.forEach(preset =>
      this.addSingleCompetitionClassFromPreset(preset));
    } else if (presetName === 'JN1Friday') {
      JN1Friday.Classes.forEach(preset =>
        this.addSingleCompetitionClassFromPreset(preset));
    } else if (presetName === 'JN2Saturday') {
      JN2Saturday.Classes.forEach(preset =>
        this.addSingleCompetitionClassFromPreset(preset));
    } else if (presetName === 'JN3Sunday') {
      JN3Sunday.Classes.forEach(preset =>
        this.addSingleCompetitionClassFromPreset(preset));
    } else if (presetName === 'JN4twoday') {
      JN4twoday.Classes.forEach(preset =>
        this.addSingleCompetitionClassFromPreset(preset));
    } 

    return;
  }

  addSingleCompetitionClassFromPreset(CompClassParams:CompetitionClassPreset) {
    let newCompClass = new CompetitionClass();
    newCompClass.Name = CompClassParams.Name

    // get the race data
    newCompClass.RaceResults = this.getRaceClassResultsFromClassCodes(CompClassParams.ClassCodes)

    // get paired race data if specified
    if (CompClassParams.PairedClassCodes) {
      newCompClass.PairedRaceResults = this.getRaceClassResultsFromClassCodes(CompClassParams.PairedClassCodes);
    }

    // define the score method
    newCompClass.ScoreMethod = CompClassParams.ScoreMethod;
    switch (CompClassParams.CompClassType as CompetitionClassType) {
      case CompetitionClassType.OneRaceIndv:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = false;
        break;
      case CompetitionClassType.OneRaceTeam:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = true;
        newCompClass.ScoreMethod_Team = CompClassParams.ScoreMethod_Team;
        newCompClass.TeamLevel = CompClassParams.TeamLevel;
        break;
      case CompetitionClassType.ManyRaceIndv:
        newCompClass.IsMultiRace = true;
        newCompClass.IsTeamClass = false;
        newCompClass.ScoreMethod_Multi = CompClassParams.ScoreMethod_Multi;
        break;
      case CompetitionClassType.ManyRaceTeam:
        newCompClass.IsMultiRace = true;
        newCompClass.IsTeamClass = true;
        newCompClass.ScoreMethod_Multi = CompClassParams.ScoreMethod_Multi;
        newCompClass.ScoreMethod_Team = CompClassParams.ScoreMethod_Team;
        newCompClass.TeamLevel = CompClassParams.TeamLevel;
        break;
    }

    // score it!
    newCompClass.computeScores();

    // add it to the competition!
    this.setState((prevstate) => ({
      competitionClasses: [...prevstate.competitionClasses, newCompClass]
    }));

    return;
  }
  
  addSingleCompetitionClass(event:FormEvent) {
    event.preventDefault();

    // validate we've got everything we need
    if (!this.state.compClassForm_name) {alert("no name"); return;}

    // create the new competition class
    let newCompClass = new CompetitionClass();

    // fill fields
    newCompClass.Name = this.state.compClassForm_name

    switch (this.state.compClassForm_type as CompetitionClassType) {
      case CompetitionClassType.OneRaceIndv:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = false;
        break;
      case CompetitionClassType.OneRaceTeam:
        newCompClass.IsMultiRace = false;
        newCompClass.IsTeamClass = true;
        newCompClass.ScoreMethod_Team = new TeamScoreMethodDefinition(
          this.state.compClassForm_teamScoreMethod,
          this.state.compClassForm_teamSizeMin,
          this.state.compClassForm_teamSizeMax,
          this.state.compClassForm_teamCollation
        );
        break;
      case CompetitionClassType.ManyRaceIndv:
        newCompClass.IsMultiRace = true;
        newCompClass.IsTeamClass = false;
        break;
      case CompetitionClassType.ManyRaceTeam:
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

  createOutputDoc() {
    let extension = "txt"
    let doc = ""

    // add things to the doc based on the style requested
    switch (this.state.outputStyle) {
      case resultsOutputStyle.plaintext:
        // doc += createOutputDoc_plaintext(this.state.competitionClasses);
        break;
      case resultsOutputStyle.genericHtml:
        // doc += createOutputDoc_genericHtml(this.state.competitionClasses);
        break;
      case resultsOutputStyle.cascadeocHtml:
        doc += createOutputDoc_CascadeOc(this.state.competitionClasses);
        extension = "html"
        break;
      case resultsOutputStyle.jn2024Html:
        doc += createOutputDoc_JN2024(this.state.competitionClasses);
        extension = "html"
        break;
      case resultsOutputStyle.jn2024LiveHtml:
        doc += createOutputDoc_JN2024live(this.state.competitionClasses);
        extension = "html";
        break;
    }
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
    const timeString = `${date.getHours().toString().padStart(2,"0")}${date.getMinutes().toString().padStart(2,"0")}`;
    const filename = `${dateString}_${timeString}_results.${extension}`

    this.downloadFile(doc, filename);
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
      <RaceFileListItem
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
        {/* <Button
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
        </Button> */}
        &nbsp;<Button
          onClick={(e) => this.handleRemoveCompClass(e)}
          id={"remove-" + compclass.ID.toString()}
          variant="outline-danger"
          size="sm"
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
        &nbsp;<b>Name:</b> {compclass.Name} 
        &nbsp;<b>Scoring:</b> {compclass.IsTeamClass ? "TEAMS // " : ""} {IndividualScoreMethod[compclass.ScoreMethod]} 
        &nbsp;

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
          <BasicDz parser={this.updateRaceResults} helpText="Drop xml file here or click to open file browser." />
        </div>

        <div>
          {fileInfo}
        </div>
        <hr />
        <div>
          Scoring Presets:
          {/* TODO: fix this later to use a sub component: https://stackoverflow.com/a/29810951 */}
          {/* <Button id="scoring-preset-COC-WL2324" onClick={() => this.loadPreset('COCWL2324')}>COC: Winter 23-24</Button>
          <Button id="scoring-preset-COC-WL2324AWTtest" onClick={() => this.loadPreset('COCWL2324_JNTEST')}>AWT TEST</Button> */}
          <Button id="scoring-preset-JN24-1Fri" onClick={() => this.loadPreset('JN1Friday')}>JN1Friday</Button>
          <Button id="scoring-preset-JN24-2Sat" onClick={() => this.loadPreset('JN2Saturday')}>JN2Saturday</Button>
          <Button id="scoring-preset-JN24-3Sun" onClick={() => this.loadPreset('JN3Sunday')}>JN3Sunday</Button>
          <Button id="scoring-preset-JN24-4multi" onClick={() => this.loadPreset('JN4twoday')}>JN MultiDay</Button>
        </div>
        <div>
          {/* <Button size="lg" onClick={this.loadPreset}>
            Load Preset Magic Button
          </Button> */}
          {/* <div>
            After loading all relevant race results, most users should&nbsp;
            <ButtonGroup className="me-2" size="sm">
              <Button size="sm">click here</Button>
              <DropdownButton id="scoring-presets-group" as={ButtonGroup} size="sm" title="">
                <Dropdown.Item>Standard: One Per Race Class</Dropdown.Item>
                <Dropdown.Item id="Scoring-Preset-COC-WL-23-24" onClick={() => this.loadPreset('COCWL2324')}>COC: Winter 23-24</Dropdown.Item>
                <Dropdown.Item>COC: Ultimate O 2024</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
            to create one competition class for each race class, or use a pre-defined template if one has been created for your events. You'll still be able to add competition classes using the <Button size="sm" variant="link" onClick={this.myToggler2}>advanced tools</Button> or remove classes that shouldn't be included if you need to make tweaks.
          </div> */}
          <Collapse in={this.state.advancedCompetitionClassDefinitionOpen}>
          <div>
          <p>
            <b>Need something more custom?</b> Select one or more race classes below, specify the appropriate parameters, and then click "create competition class" to make a class that considers the results of the selected race classes. Repeat for each competition class. If you're a regular user with repeat events or series needs, ask for a template to generate many competition classes at once.
          </p>

      {/*
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
      */}

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
                <option value={CompetitionClassType.OneRaceIndv}>Single Race - Individuals</option>
                <option value={CompetitionClassType.OneRaceTeam}>Single Race - Teams</option>
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
                <option value={IndividualScoreMethod.PointsOusaAverageWinningTime}>OUSA Scholastic Average Winning Time points</option>
                {/* <option value={IndividualScoreMethod.AlphaWithoutTimes}>Alpha: Remove times and status. List participants</option> */}
              </Form.Select>
            </Form.Group>

            {/* TODO: only show the team stuff if a team class type is selected. */}

            <Form.Group>
              <Form.Label>Collation for Team competition class</Form.Label>
              <Form.Select id='comp-class-select-ScoreMethod-team-collation'
                  value={this.state.compClassForm_teamCollation}
                  onChange={this.handleCompClassTeamCollationChange}>
                <option value={TeamCollationMethod.ScoreThenCombine}>Score each race class individually, then combine into teams.</option>
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
                <option value={TeamScoreMethod.SumMinLowestWins}>Sum minimum, lowest wins</option>
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
          </div></Collapse>
        </div>

        <div>
          <h4>Download Results</h4>
          {/* this isn't actually COC, it's whatever's hardcoded on the results */}
          <Button id="dl-output-doc" onClick={this.createOutputDoc}>Create Output</Button>
          {/* <ButtonGroup className="me-2">
              <DropdownButton id="download-results-group" title="Download Results"
                variant="outline-primary">
                <Dropdown.Item>Plaintext</Dropdown.Item>
                <Dropdown.Item>Generic HTML</Dropdown.Item>
                <Dropdown.Item id="Download-Results-Coc-Html" onClick={this.createOutputDoc}>COC HTML</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup> */}
        </div>

        <hr />

        <Row>
          <h4>Review Competition Classes</h4>
          <p>
            These competition classes have been defined and will be included in output.
          </p>
          <div>
            <ul>
            {configuredCompetitionClasses}
            </ul>
          </div>
        </Row>
      </div>
    )
  }
}