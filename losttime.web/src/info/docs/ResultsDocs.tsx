import React from "react";
import { Col, Row } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";

export class ResultsDocs extends React.Component<{}, {}, {}> {

    render () {
        return (
            <Row id='results'>
            <Col>
                <SectionTitle title="Results" line={true} />
                <h4>Inputs</h4>
                <p>Coming soon</p>
                <h4>Outputs</h4>
                <p>Coming soon</p>
            </Col>
            </Row>
        );
    };
}