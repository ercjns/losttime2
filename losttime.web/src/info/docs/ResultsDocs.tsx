import React from "react";
import { Col, Row } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";
import { Accordion } from "react-bootstrap";

export class ResultsDocs extends React.Component<{}, {}, {}> {

    render () {
        return (
            <Row id='results'>
            <Col>
                <SectionTitle title="Results" line={true} />
                <h4>Inputs</h4>
                <p>Export a file from your event management system (SportSoftware/OE, MeOS, or others) in the <a href="https://orienteering.sport/iof/it/data-standard-3-0/">IOF XML v3</a> <code>ResultList</code> format. This can be splits or just finish results. When combining multiple events, the class <code>code</code>s are expected to be the same across each individual event in order to combine for multi-day or series results.</p>
                <h4>Options</h4>
                <p>Only pre-defined class definitions are supported. Examples can be found on <a href="https://github.com/ercjns/losttime2/tree/main/losttime.web/src/results/competitionpresets">GitHub</a>. Manual creation of class definitions may be added to the UI in the future.</p>
                <h4>Outputs</h4>
                <p>Output formats must be pre-defined. A generic html or txt format may be available in the future.</p>
            </Col>
            </Row>
        );
    };
}