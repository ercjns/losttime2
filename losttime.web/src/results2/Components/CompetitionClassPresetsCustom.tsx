import { Button, Col, Form, Row } from "react-bootstrap";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { raceClassesByRace } from "./CompetitionClassComposer";
import { useState } from "react";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
}

const buttons = [
    {
        org: "COC",
        id: "cascade-ultimate2025-single",
        label: "2025 Ultimate: Single Event"
    },
    {
        org: "COC",
        id: "cascade-ultimate2025-series",
        label: "2025 Ultimate: Series"
    }
]

export function CompetitionClassPresetsCustom(props:CompetitionClassPresetsProps) {

    const [host, setHost] = useState("COC")

    const liveButtons = buttons.map((x) => {
        if (x.org === host) {
            return <Col sm={12} md={6} lg={4}>
                <Button
                    key={x.id}
                    id={x.id}
                    variant="outline-primary"
                    >{x.label}</Button>
                </Col>
        } else {
            return ""
        }
    })

    return <Row className="mb-2">
        <p>
        <Form.Select aria-label="Select Organization" onChange={(e)=>setHost(e.target.value)}>
            {/* <option value="">select organization...</option> */}
            <option value="COC">Cascade Orienteering Club</option>
        </Form.Select>
        </p>
        {liveButtons}
    </Row>
}