import React from "react";
import { PageTitle } from "../shared/PageTitle";
import { Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { SectionTitle } from "../shared/SectionTitle";

export class Landing extends React.Component<{}, {}, {}> {

    render () {
        return (
            <div>
            <PageTitle 
              title="Lost Time Orienteering" 
            />
            <p>
              <i>A collection of tools for orienteering event organizers to help make up for Lost Time.</i>
            </p>
            <Row>
                <Col xs={12} md={6} xl={{span:4,offset:1}}>
                    <h2 className="orange-small-caps text-center">Entries</h2>
                    <div className="text-center">
                    <Button href="/entries">
                        <FontAwesomeIcon icon={faAddressCard} /> Manage Entries
                    </Button>
                    </div>
                    <p className="text-center">
                    Combine and format entry files for easy import to Sport Software.<br />
                    Create lists of pre-registered participants for use at check-in.
                    </p>
                </Col>
                <Col xs={12} md={6} xl={{span:4,offset:2}}>
                    <h2 className="orange-small-caps text-center">Results</h2>
                    <div className="text-center">
                    <Button href="/results">
                        <FontAwesomeIcon icon={faFlagCheckered} /> Create Results
                    </Button>
                    </div>
                    <p className="text-center">
                    Transform results files to look great on your website.<br/>
                    Assign points using custom scoring methods.
                    Calculate team scores.<br/>
                    Combine results from multiple events to create multi-day or series standings.<br/>
                    </p>
                    
                </Col>
            </Row>

            <SectionTitle title="Customization and Contributing" line={true}/>
            <Row>
            <Col>
            <p>If you'd like to use Lost Time for your club, there are generic templates available, but the tool is most powerful with customized formatting and scoring functions specific to your club. Send me an email to get started, or check out the source on <a href="https://github.com/ercjns/losttime2">github</a>. Pull requests are welcome!</p>
            </Col>
            </Row>
            </div>
        )
    }
}