import { Button, Col, Form, Row } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { raceClassesByRace } from "./CompetitionClassComposer";
import { useState } from "react";
import { presets } from "../../CompetitionClass/Templates/CompetitionClassPresets_Cascade";
import { CompetitionClassPresetButton } from "../../CompetitionClass/Templates/CompetitionClassPresetButton";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
}

let buttons:CompetitionClassPresetButton[] = []
buttons.push(...presets)

export function CompetitionClassPresetsCustom(props:CompetitionClassPresetsProps) {

    const [org, setOrg] = useState("COC")

    const liveButtons = buttons.map((x) => {
        if (x.org === org) {
            return <Col sm={12} md={6} lg={4} key={`${x.id}-container`}>
                <Button
                    key={x.id}
                    id={x.id}
                    variant="outline-primary"
                    onClick={()=>x.onClick(props)}
                    >{x.label}</Button>
                </Col>
        } else {
            return ""
        }
    })

    return <Row className="mb-2">
        <p>
        <Form.Select aria-label="Select Organization" onChange={(e)=>setOrg(e.target.value)}>
            {/* <option value="">select organization...</option> */}
            <option value="COC">Cascade Orienteering Club</option>
        </Form.Select>
        </p>
        {liveButtons}
    </Row>
}