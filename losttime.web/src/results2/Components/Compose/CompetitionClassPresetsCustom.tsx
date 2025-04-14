import { Button, Col, Form, Row } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { raceClassesByRace } from "./CompetitionClassComposer";
import { useState } from "react";
import { CompetitionClassPresetButton } from "../../CompetitionClass/Templates/CompetitionClassPresetButton";

import { presets as presets_Cascade } from "../../CompetitionClass/Templates/CompetitionClassPresets_Cascade";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
}

let buttons:CompetitionClassPresetButton[] = []
buttons.push(...presets_Cascade)

export function CompetitionClassPresetsCustom(props:CompetitionClassPresetsProps) {

    const [org, setOrg] = useState("COC")

    const liveButtons = buttons.map((x) => {
        if (x.org === org) {
            return <Col sm={12} lg={6} key={`${x.id}-container`} className="mb-1">
                <Button
                    key={x.id}
                    id={x.id}
                    variant="outline-primary"
                    onClick={()=>x.onClick(props)}
                    disabled={!x.isEnabledWhen(props)}
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