import React from 'react';
import './App.css';
import Papa from 'papaparse';
import { BasicDz } from './components/dz';
import * as SS from './orienteering/SportSoftware'
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { LtEntry, parseEnties } from './lt/Entry';
import { Header } from './components/Header';
import { PageTitle } from './components/PageTitle';
import {Entry} from './components/Entry';
import {EntryFile, entryFileMeta} from './components/EntryFile';
import { RegistrationClassCount } from './components/RegistrationClassCount';
import { buildCheckInPdf } from './orienteering/RegistrationCheckinPdf';

type myformstate = {
  filesprocessed: entryFileMeta[],
  entries: LtEntry[],
  nextstartno: number
}

class EntryProcessor extends React.Component<{}, myformstate, {}> {
  constructor(props:{}) {
    super(props);
    this.state = {
      filesprocessed: [],
      entries: [],
      nextstartno: 1000
    }

    this.downloadOeRegCsv = this.downloadOeRegCsv.bind(this);
    this.updateEntries = this.updateEntries.bind(this);
    this.handleClearEntries = this.handleClearEntries.bind(this);
    this.nowtimestring = this.nowtimestring.bind(this);
    this.downloadpdf = this.downloadpdf.bind(this);
  }

  handleClearEntries() {
    this.setState({entries: [], filesprocessed: []});
  }

  downloadOeRegCsv(isScoreO:boolean=false) {
    if (this.state.entries.length === 0) {
      console.log("No entries");
      return
    }

    const forexport = SS.fromLtEntries(this.state.entries)

    // export assigns start numbers to the LtEntry, so update state here
    this.setState({entries: this.state.entries});

    const unparseconfig:Papa.UnparseConfig = {
      quotes: false,
      delimiter: ";",
      header: true,
      skipEmptyLines: "greedy",
      columns: isScoreO ? SS.COLUMNS_SCOREO : SS.COLUMNS_STANDARD
    }

    const csvstring:string = Papa.unparse(forexport, unparseconfig);
    const nowstring:string = this.nowtimestring();
    const el = document.createElement('a');
    el.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvstring);
    el.target = '_blank';
    el.download = 'EntriesForOe-'.concat(nowstring, '.csv');
    el.click();
  }

  nowtimestring():string {
    const now:Date = new Date();
    const y = now.getFullYear().toString();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const H = now.getHours().toString().padStart(2, "0");
    const M = now.getMinutes().toString().padStart(2, "0");
    return y.concat(m, d, 'T', H, M);
  }

  updateEntries(file:File) {
    Papa.parse(file, {
            header: true,
            transform: (value, col) => {return(value.replace(/\0/g, '').trim())},
            complete: (results, file:File) => {
      const parsed = parseEnties(results.data, this.state.nextstartno);
      const newentries = this.state.entries.concat(parsed.data);
      this.setState({entries: newentries, nextstartno: parsed.meta.maxstartno})

      const newfile:entryFileMeta = {
        name: file.name,
        success: parsed.meta.success,
        failed: parsed.meta.failed,
        empty: parsed.meta.empty
      };
      this.setState({
        filesprocessed: [...this.state.filesprocessed, newfile]
      });
  }
  });
  }

  downloadpdf() {
    const checkInPdf = buildCheckInPdf(this.state.entries);
    const fileName:string = 'Registrations-'.concat(this.nowtimestring(), '.pdf');
    checkInPdf.download(fileName);
  }

  render() {
    const entries = (this.state.entries.length > 0) ? 
      this.state.entries.map((entry) =>
      <Entry 
        value={entry}
      />) :
      <tr>
        <td colSpan={6} style={{textAlign:'center'}}>
          No Registrations to Show
        </td>
      </tr>
    ;

    const files = this.state.filesprocessed.map((filemeta) =>
      <EntryFile
        name={filemeta.name}
        success={filemeta.success}
        failed={filemeta.failed}
        empty={filemeta.empty}
      />
    );

    const regclasshist = this.state.entries.reduce(function(regclasshist: {[key:string]: number}, reg:LtEntry) {
      if (!regclasshist[reg.ClassId]) {
        regclasshist[reg.ClassId] = 1;
      } else {
        regclasshist[reg.ClassId]++;
      }
      return regclasshist;
    }, {});
  
    const regmeta = Object.entries(regclasshist);


    const counts = regmeta.sort((a, b) => a[0].toLocaleLowerCase().localeCompare(b[0].toLocaleLowerCase())).map((regclass) => 
    <RegistrationClassCount
      classname={regclass[0]}
      regcount={regclass[1]}
    />
  );

    return (
      <div>
        <PageTitle 
          title="Pre-Process Registration Files" 
        />
        <p>
          Save event registration information in .csv format. Upload multiple files to combine registration information from multiple sources. (Todo: click to expand for supported csv formats)
        </p>
        <p>
          This tool creates outputs ready for import into SportSoftware (OE) and PDF files to print and use at check-in.
        </p>
        <h4>Files</h4>
        <p>
          <BasicDz parser={this.updateEntries}/>
        </p>
        <Row>
          <Col xs={12} md={6}>
            <Row>
              <p>Files Uploaded: {this.state.filesprocessed.length}</p>
              <p><ul>{files}</ul></p>
              <p>Registrations by Class (Total: {this.state.entries.length})</p>
              <p>
              <Row>
                {counts}
              </Row>
              </p>

            </Row>
            <Row>
              <ButtonToolbar>
                <ButtonGroup className="me-2">
                  <DropdownButton title="Download OE File" 
                    variant="primary"
                    disabled={this.state.entries.length > 0 ? false:true}>
                    <Dropdown.Item onClick={() => this.downloadOeRegCsv()}>Regular</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.downloadOeRegCsv(true)}>Score O</Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                <Button 
                  variant="primary" 
                  onClick={this.downloadpdf}
                  disabled={this.state.entries.length > 0 ? false:true}>
                  Download Check-In PDF
                </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button 
                    variant="outline-secondary" 
                    onClick={this.handleClearEntries}>
                    Clear Registrations
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Row>
          </Col>
          <Col xs={6} md={6}>

            <table style={{textAlign: 'left'}}>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Last</th>
                  <th>Chip</th>
                  <th>Rented?</th>
                  <th>Class</th>
                  <th>Start #</th>
                </tr>
              </thead>
              <tbody>
                {entries}
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Container fluid style={{
        backgroundColor: '#F7F7F7',
      }}>
        <Header />
        <Row>
        <Col xs={{span:10, offset:1}}>
          <EntryProcessor />
        </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
