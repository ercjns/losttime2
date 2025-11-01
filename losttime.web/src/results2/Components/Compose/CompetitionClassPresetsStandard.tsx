import { Button, Col, Row } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { CompetitionClass } from "../../CompetitionClass/CompetitionClass";
import { Standard_Time } from "../../CompetitionClass/Variants/Standard_Time";
import { Standard_ScoreO } from "../../CompetitionClass/Variants/Standard_ScoreO";
import { RaceResultsData } from "../FileLoader";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceResultsData: RaceResultsData[]
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
}

export function CompetitionClassPresetsStandard(props:CompetitionClassPresetsProps) {

    function onePerClassClickHandler() {
        props.raceClassesByClass.forEach((data, name) => {
            if (data.length === 1 && data[0] !== undefined) {
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Standard_Time(data[0]!.class.name,[data[0]!])]
                )
            }
        })
    }

    function onePerClassScoreOClickHandler() {
        props.raceClassesByClass.forEach((data, name) => {
            if (data.length === 1 && data[0] !== undefined) {
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Standard_ScoreO(data[0]!.class.name,[data[0]!])]
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
            disabled={(props.raceResultsData.length !== 1)}
            >
        Standard O Competition Classes</Button>
        </Col>
        <Col sm={12} md={6}>
        <Button 
            id="one-comp-class-per-race-class-score-o"
            variant="outline-primary"
            onClick={()=>onePerClassScoreOClickHandler()}
            disabled={(props.raceResultsData.length !== 1)}
            >
        Score O Competition Classes</Button>
        </Col>
    </Row>
}