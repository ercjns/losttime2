import { Button, Col, Row } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { CompetitionClass } from "../../CompetitionClass/CompetitionClass";
import { Standard_Time } from "../../CompetitionClass/Variants/Standard_Time";
import { raceClassesByRace } from "./CompetitionClassComposer";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
}

export function CompetitionClassPresetsStandard(props:CompetitionClassPresetsProps) {

    function onePerClassClickHandler() {
        props.raceClassesByClass.forEach((data, name) => {
            if (data.length === 1 && data[0] !== undefined) {
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Standard_Time(data[0]!.xmlClass.Name,[data[0]!])]
                )
            }
        })
    }

    return <Row className="mb-2">
        <Col sm={12} md={6}>
        <Button 
            id="one-comp-class-per-race-class"
            variant="outline-primary"
            onClick={()=>onePerClassClickHandler()}
            disabled={(props.raceClassesByRace.size !== 1)}
            >
        One Competition Class For Each Race Class</Button>
        </Col>
    </Row>
}