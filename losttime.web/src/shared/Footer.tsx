import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faMastodon } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Row } from "react-bootstrap";

export class Footer extends React.Component {
    render() {
        return (
            <Row className="justify-content-center mt-5">
                <Col md={8}>
                <p style={{textAlign:'center'}}>
                    <i>Questions, comments, suggestions, or just want to say thanks?</i><br />
                    <FontAwesomeIcon icon={faMastodon} /> @eric@social.ridetrans.it &nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon icon={faEnvelope} /> eric (at) ercjns (dot) com
                </p>
                </Col>
            </Row>
        )
    }
}