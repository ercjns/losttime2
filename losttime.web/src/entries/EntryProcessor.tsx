import React from 'react';
import Papa from 'papaparse';
import * as jschardet from 'jschardet'
import { Button, ButtonGroup, ButtonToolbar, Col, Dropdown, DropdownButton, Form, FormControl, Row } from 'react-bootstrap';
import { BasicDz } from '../shared/dz';
import * as SS from '../shared/orienteeringtypes/SportSoftware'
import { LtEntry, parseEnties } from './EntryFileParser';
import { PageTitle } from '../shared/PageTitle';
import {EntriesTableRow} from './components/EntriesTableRow';
import {EntryFilesListItem, entryFileMeta} from './components/EntryFilesListItem';
import { EntriesByClassItem } from './components/EntriesByClassItem';
import { buildCheckInPdf } from './RegistrationCheckinPdf';
import { SectionTitle } from '../shared/SectionTitle';

type myformstate = {
    filesprocessed: entryFileMeta[],
    entries: LtEntry[],
    nextstartno: number,
    pdftextvalue: string
  }

export class EntryProcessor extends React.Component<{}, myformstate, {}> {
    constructor(props:{}) {
      super(props);
      this.state = {
        filesprocessed: [],
        entries: [],
        nextstartno: 1000,
        pdftextvalue: ''
      }
      
      this.downloadOeRegCsv = this.downloadOeRegCsv.bind(this);
      this.updateEntries = this.updateEntries.bind(this);
      this.handleClearEntries = this.handleClearEntries.bind(this);
      this.nowtimestring = this.nowtimestring.bind(this);
      this.downloadpdf = this.downloadpdf.bind(this);
      this.onpdftextchange = this.onpdftextchange.bind(this);
      this.handleFixUltClasses = this.handleFixUltClasses.bind(this);
    }
  
    handleClearEntries() {
      this.setState({entries: [], filesprocessed: []});
    }

    handleFixUltClasses() {
      let old = this.state.entries;
      this.setState({entries: old.map((x) => {
        if (x.ClassId.includes("70") && x.ClassId.includes("O")) {
          x.ClassId = "O70+"
          return x
        } else if (x.ClassId.includes("70") && x.ClassId.includes("F")) {
          x.ClassId = "F70+"
          return x
        } else if (x.ClassId.includes("50") && x.ClassId.includes("O")) {
          x.ClassId = "O50+"
          return x
        } else if (x.ClassId.includes("50") && x.ClassId.includes("F")) {
          x.ClassId = "F50+"
          return x
        } else if (x.ClassId.includes("16") && x.ClassId.includes("O")) {
          x.ClassId = "O-16"
          return x
        } else if (x.ClassId.includes("16") && x.ClassId.includes("F")) {
          x.ClassId = "F-16"
          return x
        } else if (x.ClassId.includes("18") && x.ClassId.includes("O")) {
          x.ClassId = "O-18"
          return x
        } else if (x.ClassId.includes("18") && x.ClassId.includes("F")) {
          x.ClassId = "F-18"
          return x
        } else if (x.ClassId.includes("20") && x.ClassId.includes("O")) {
          x.ClassId = "O-20"
          return x
        } else if (x.ClassId.includes("20") && x.ClassId.includes("F")) {
          x.ClassId = "F-20"
          return x
        } else if (x.ClassId.includes("21") && x.ClassId.includes("O")) {
          x.ClassId = "O-21+"
          return x
        } else if (x.ClassId.includes("21") && x.ClassId.includes("F")) {
          x.ClassId = "F-21+"
          return x
      } else {
         return x
      }})
      })
    }
  
    downloadOeRegCsv(OEversion:string="12",isScoreO:boolean=false) {
      if (this.state.entries.length === 0) {
        console.log("No entries");
        return
      }
  
      const forExport = SS.fromLtEntries(this.state.entries)
  
      // export assigns start numbers to the LtEntry, so update state here
      this.setState({entries: this.state.entries});
      let cols:string[] = []
      if (OEversion === "11") {
        cols = isScoreO ? SS.COLUMNS_SCOREO : SS.COLUMNS_STANDARD
      } else if (OEversion === "12") {
        cols = isScoreO ? SS.COLUMNS_SCOREO_V12 : SS.COLUMNS_STANDARD_V12
      }
  
      const unparseconfig:Papa.UnparseConfig = {
        quotes: false,
        delimiter: ";",
        header: true,
        skipEmptyLines: "greedy",
        columns: cols
      }
  
      const csvstring:string = Papa.unparse(forExport, unparseconfig);
      const nowstring:string = this.nowtimestring();
      const el = document.createElement('a');
      el.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvstring);
      el.target = '_blank';
      el.download = 'EntriesForOe'.concat(OEversion==="11" ? '11' : '12').concat('-', nowstring, '.csv');
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
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e !== null && e.target !== null && e.target.result !== null) {
          console.log(e.target.result);
          if (e.target.result instanceof ArrayBuffer) {
            // Detect encoding
            const binStr = String.fromCharCode(...new Uint8Array(e.target.result))
            const enc = jschardet.detect(binStr)
            console.log(enc)

            // parse with that encoding hint
            Papa.parse(file, {
                header: true,
                encoding: enc.encoding,
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
        }
      }
      reader.readAsArrayBuffer(file)      
    }
  
    downloadpdf(headerText:string='') {
      const checkInPdfs = buildCheckInPdf(this.state.entries, this.state.filesprocessed.map((x) => x.name), headerText);
      const fileTimeString = this.nowtimestring();
      for (const pdf of checkInPdfs) {
        const fileName:string = 'Registrations-'.concat(fileTimeString, '-', pdf.name, '.pdf');
        pdf.doc.download(fileName); 
      }
    }
  
    onpdftextchange(e:React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      this.setState({pdftextvalue:e.target.value});
    }
  
    render() {
      const entries = (this.state.entries.length > 0) ? 
        this.state.entries.map((entry) =>
        <EntriesTableRow 
          key={`${entry.FirstName}-${entry.LastName}-${entry.Club}-${entry.ClassId}`}
          value={entry}
        />) :
        <tr>
          <td colSpan={6} style={{textAlign:'center'}}>
            No entries
          </td>
        </tr>
      ;
  
      const files = this.state.filesprocessed.map((filemeta) =>
        <EntryFilesListItem
          name={filemeta.name}
          success={filemeta.success}
          failed={filemeta.failed}
          empty={filemeta.empty}
        />
      );
  
      const regclasshist = this.state.entries.reduce(function(regclasshist: {[key:string]: number}, reg:LtEntry) {
        if (!reg.GroupLeader) {
          return regclasshist;
        }
        if (!regclasshist[reg.ClassId]) {
          regclasshist[reg.ClassId] = 1;
        } else {
          regclasshist[reg.ClassId]++;
        }
        return regclasshist;
      }, {});
    
      const regmeta = Object.entries(regclasshist);
  
      const counts = regmeta.sort((a, b) => a[0].toLocaleLowerCase().localeCompare(b[0].toLocaleLowerCase())).map((regclass) => 
      <EntriesByClassItem
        key={regclass[0]}
        classname={regclass[0]}
        regcount={regclass[1]}
      />
      );
  
      return (
        <div>
          <PageTitle 
            title="Manage Entries" 
          />
          <p>
            This tool can create outputs for two different event functions:
          </p> 
          <ul>
            <li>People responsible for results can create files for easy import of entries into SportSoftware (OE). </li>
            <li>People managing on-site check-in can create PDF files ready to print and use.</li>
          </ul>
          <p>
            Start by uploading a file with event entry information. It is possible to add multiple files, including those from different systems, to combine entry information from multiple sources into one output. Verify the summaries, then select the desired output. Supported file formats are outlined in the <a href="/docs#entries">docs</a>.
          </p>
          
          <SectionTitle title="Files" line={false}/>
          <BasicDz parser={this.updateEntries} helpText="Drop csv file(s) here or click to open file browser."/>
          <p className='mt-2'>Files Uploaded: {this.state.filesprocessed.length} &nbsp; {this.state.filesprocessed.length > 0 ? 
          <Button 
            variant="outline-secondary" 
            onClick={this.handleClearEntries}>
            Reset - Clear Files
          </Button> : <span></span>}</p>
          <ul>{files}</ul>
          <Row>
            <Col xs={12} md={6}>
            <SectionTitle title={"Summary: "+this.state.entries.filter(entry => entry.GroupLeader === true).length.toString()+" starts"} line={true} />
              <Row>

                <p><i>Solo participants and group leaders are counted; additional group members do not count towards total starts.</i></p>
                <Row data-testid="starts-by-class-items">
                  <p>Starts by Class:</p>
                  {counts}
                </Row>
  
              </Row>
              <Row>
                <p>
                <Button 
                  variant='outline-secondary'
                  onClick={()=>this.handleFixUltClasses()}>
                  COC: fix Ultimate Classes
                </Button>
                </p>
              </Row>
              <Row>
                <ButtonToolbar>
                  <ButtonGroup className="me-2">
                    <DropdownButton title="Download OE File" 
                      variant="primary"
                      disabled={this.state.entries.length > 0 ? false:true}>
                      <Dropdown.Item onClick={() => this.downloadOeRegCsv("12", false)}>OE12 - Regular</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.downloadOeRegCsv("12", true)}>OE12 - Score O</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.downloadOeRegCsv("11", false)}>OE11 - Regular</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.downloadOeRegCsv("11", true)}>OE11 - Score O</Dropdown.Item>
                    </DropdownButton>
                  </ButtonGroup>
                  <ButtonGroup className="me-2">
                  <Dropdown>
                    <Dropdown.Toggle className={this.state.entries.length > 0 ? "":"disabled"}>
                      Download Check-In PDFs
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ minWidth: '20rem' }}>
                      <Dropdown.ItemText>Additional Custom Header Text:</Dropdown.ItemText>
                      <Row className="justify-content-center">
                        <Col xs={12}>
                          <Form 
                            style= {{marginRight: '16px', marginLeft: '16px'}}
                            onSubmit={(e) => {e.preventDefault(); this.downloadpdf(this.state.pdftextvalue)}}>
                            <FormControl type='text' onChange={this.onpdftextchange} value={this.state.pdftextvalue}></FormControl>
                            <Button style= {{marginTop: '8px'}} type='submit' disabled={this.state.entries.length > 0 ? false:true}>Download PDFs</Button>
                          </Form>
                        </Col>
                      </Row>
                    </Dropdown.Menu>
                  </Dropdown>
                  </ButtonGroup>
                </ButtonToolbar>
              </Row>
            </Col>
            <Col xs={6} md={6}>
            <SectionTitle title={"All Entries: "+this.state.entries.length.toString()+" participants"} line={true}/>
  
              <table style={{textAlign: 'left'}}>
                <thead>
                  <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Group</th>
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