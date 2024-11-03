import React from "react";
import { PageTitle } from "../shared/PageTitle";
import { Accordion, Col, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../shared/SectionTitle";

export class Documentation extends React.Component<{}, {}, {}> {

    render () {
        return (
            <div>
            <PageTitle title="Documentation" />
            <Row>
                <Col>
                    <SectionTitle title="Entries" line={true}/>
                    <h4>Input File Formats</h4>
                    <p>Currently LostTime supports two entries formats used by Cascade Orienteering Club. Additional formats may be requested. Future work may include adding support for generic formats and the ability to parse files without a pre-defined format.</p>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>Cascade OC Registration .csv</Accordion.Header>
                        <Accordion.Body>
                        <p>Cascade OC Registration system csv. Can be created by clicking "download registrations" from the admin section of an event at register.cascadeoc.org. The file must contain a header row with the exact column names listed.</p>
                        <pre>
                        FirstName, LastName, Email, Club, Class, Sex, EPunch, Rental, Phone, EmergencyPhone, CarLicense, BirthYear, Newcomer, Group, Paid, Owed, Waiver
                        </pre>

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
                        <pre>
                        Bib, SI Card, Rental, First Name, Last Name, Gender, School Code, Course, NC
                        </pre>

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
                    
                    <p>Coming soon</p>

                </Col>
            </Row>
            <Row>
                <Col>
                    <SectionTitle title="Results" line={true} />
                    <h4>Inputs</h4>
                    <p>Coming soon</p>
                    <h4>Outputs</h4>
                    <p>Coming soon</p>
                </Col>
            </Row>
            </div>
        )
    };
}