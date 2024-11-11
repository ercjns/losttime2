import React from "react";
import { Accordion, Col, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";
import FileExample_Owned from "../../assets/docs/FileExample_Owned.png";
import FileExample_Rental from "../../assets/docs/FileExample_Rental.png";

export class EntriesDocs extends React.Component<{}, {}, {}> {

    render () {
        return (
            <Row id='entries'>
                <Col>
                    <SectionTitle title="Entries" line={true}/>
                    <h4>Inputs</h4>
                    <p>Currently LostTime supports two entries formats used by Cascade Orienteering Club. Additional formats may be requested. Future work may include adding support for generic formats and the ability to parse files without a pre-defined format.</p>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>Cascade OC Registration .csv</Accordion.Header>
                        <Accordion.Body>
                        <p>Cascade OC Registration system csv. Can be created by clicking "download registrations" from the admin section of an event at register.cascadeoc.org. The file must contain a header row with the exact column names listed.</p>
                        <code>
                        FirstName, LastName, Email, Club, Class, Sex, EPunch, Rental, Phone, EmergencyPhone, CarLicense, BirthYear, Newcomer, Group, Paid, Owed, Waiver
                        </code>

                        <Table striped bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Column Header</th>
                                    <th>Usage</th>
                                    <th>Values</th>
                                    <th>Explanation</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr><td>FirstName</td><td>Optional</td><td>Text</td><td>First/Given Name.</td></tr>
                            <tr><td>LastName</td><td>Required</td><td>Text</td><td>Last/Family Name.</td></tr>
                            <tr><td>Email</td><td>Optional</td><td>Text</td><td>Email address.</td></tr>
                            <tr><td>Club</td><td>Required</td><td>Text</td><td>Club Abbreviation. Use "None" if no club.</td></tr>
                            <tr><td>Class</td><td>Required</td><td>Text</td><td>Class code for this participant's race class.</td></tr>
                            <tr><td>Sex</td><td>Optional</td><td>M | F</td><td></td></tr>
                            <tr><td>EPunch</td><td>Optional</td><td>Number</td><td>SportIdent Epunch number. Leave blank if unknown or renting.</td></tr>
                            <tr><td>Rental</td><td>Required</td><td>TRUE | FALSE</td><td>True if EPunch is a rental, or if this participant needs to rent an EPunch.</td></tr>
                            <tr><td>Phone</td><td>Optional</td><td>Text</td><td>Phone Number.</td></tr>
                            <tr><td>EmergencyPhone</td><td>Optional</td><td>Text</td><td>Phone Number.</td></tr>
                            <tr><td>CarLicense</td><td>Optional</td><td>Text</td><td>Vehicle License Plate.</td></tr>
                            <tr><td>BirthYear</td><td>Optional</td><td>Number</td><td>Year Born. Use full year: 1990, not 90.</td></tr>
                            <tr><td>Newcomer</td><td>Optional</td><td>TRUE | FALSE</td><td>TRUE if this is a newcomer.</td></tr>
                            <tr><td>Group</td><td>Optional</td><td>Number | *</td><td>Blank for solo participants. For group leaders, enter the total number of people in the group. For group members, enter "*".</td></tr>
                            <tr><td>Paid</td><td>Optional</td><td>TRUE | FALSE</td><td>True if this entry is pre-paid.</td></tr>
                            <tr><td>Owed</td><td>Optional</td><td>Number</td><td>Dollars to be paid at check-in.</td></tr>
                            <tr><td>Waiver</td><td>Optional</td><td>TRUE | FALSE</td><td>True if valid up-to-date waiver is on file.</td></tr>
                            </tbody>
                        </Table>
                        </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                        <Accordion.Header>WIOL Registration .csv</Accordion.Header>
                        <Accordion.Body>
                        <p>WIOL registration system csv. The file must contain a header row with the exact column names listed.</p>
                        <code>
                        Bib, SI Card, Rental, First Name, Last Name, Gender, School Code, Course, NC
                        </code>

                        <Table striped bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Column Header</th>
                                    <th>Usage</th>
                                    <th>Values</th>
                                    <th>Explanation</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr><td>Bib</td><td>Optional</td><td>Number</td><td>Bib number.</td></tr>
                            <tr><td>SI Card</td><td>Optional</td><td>Number</td><td>SportIdent Epunch number. Leave blank if unknown or renting.</td></tr>
                            <tr><td>Rental</td><td>Optional</td><td>X</td><td>X if EPunch is a rental or if this participant needs to rent an EPunch. Otherwise leave blank.</td></tr>
                            <tr><td>First Name</td><td>Optional</td><td>Text</td><td>First/Given Name.</td></tr>
                            <tr><td>Last Name</td><td>Required</td><td>Text</td><td>Last/Family Name.</td></tr>
                            <tr><td>Gender</td><td>Optional</td><td>M | F</td><td></td></tr>
                            <tr><td>School Code</td><td>Required</td><td>Text</td><td>WIOL School Code.</td></tr>
                            <tr><td>Course</td><td>Required</td><td>Text</td><td>Class code for this participant's <b>race class</b>.</td></tr>
                            <tr><td>NC</td><td>Optional</td><td>X</td><td>X if this entry should be considered non-competitive, such as a second course or running at a different level.</td></tr>
                            </tbody>
                        </Table>

                        </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>
                    <p></p>

                    <h4>Outputs</h4>
                    <h5>Sport Software (OE)</h5>
                    <p>Files are ready for import into <b>OE2010</b>, <b>OE12</b>, or <b>OEScore</b>. Use <code>Entries &gt; Import</code> with file format selections <code>Export file of a Single Day Event</code> and <code>Character separated columns (CSV)</code>, selecting semicolon (<code>;</code>) as the field delimiter and <code>None</code> as the string delimiter.</p>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>Sport Software Entries csv</Accordion.Header>
                        <Accordion.Body>
                        <code>
                        OE0001;Stno;XStno;Chipno;Database Id;Surname;First name;YB;S;Block;nc;Start;Finish;Time;Classifier;Credit -;Penalty +;Comment;Club no.;Cl.name;City;Nat;Location;Region;Cl. no.;Short;Long;Entry cl. No;Entry class (short);Entry class (long);Rank;Ranking points;Num1;Num2;Num3;Text1;Text2;Text3;Addr. surname;Addr. first name;Street;Line2;Zip;Addr. city;Phone;Mobile;Fax;EMail;Rented;Start fee;Paid;Team;Course no.;Course;km;m;Course controls
                        </code>
                        </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                        <Accordion.Header>Sport Software Score-O Entries csv</Accordion.Header>
                        <Accordion.Body>
                        <code>
                        OESco0001;Stno;XStno;Chipno;Database Id;Surname;First name;YB;S;Block;nc;Start;Finish;Time;Classifier;Credit -;Penalty +;Comment;Club no.;Cl.name;City;Nat;Location;Region;Cl. no.;Short;Long;Entry cl. No;Entry class (short);Entry class (long);Rank;Ranking points;Num1;Num2;Num3;Text1;Text2;Text3;Addr. surname;Addr. first name;Street;Line2;Zip;Addr. city;Phone;Mobile;Fax;EMail;Rented;Start fee;Paid;Team;Course no.;Course;km;m;Course controls
                        </code>
                        </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>
                    
                    <p></p>
                    <h5>Check-in PDFs</h5>
                    <p>There are always three files created: Owned, Rental-A, and Rental-B. The two Rental files have the same contents. It's useful to have two copies so that one is always present at registration while the other moves to/from data entry.<br />
                    The <code>Additional Custom Header Text</code> is optional text printed at the top of the page. Add the event title or any other text.</p>
                    <p></p>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>Check-In PDF - Owned</Accordion.Header>
                        <Accordion.Body>
                        <p>Columns: First, Last, Owed, Waiver, Course, Epunch, Club, Phone, Emerg. Ph., Vehicle</p>
                        <img src={FileExample_Owned} alt="Screenshot of Owned Punches PDF file" style={{maxWidth:'100%'}}/>
                        </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                        <Accordion.Header>Check-In PDF - Rental</Accordion.Header>
                        <Accordion.Body>
                        <p>Columns: First, Last, Owed, Waiver, Course, Epunch, Club, Phone, Emerg. Ph., Vehicle</p>
                        <img src={FileExample_Rental} alt="Screenshot of Rental Punches PDF file" style={{maxWidth:'100%'}}/>
                        </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        );
    };
}