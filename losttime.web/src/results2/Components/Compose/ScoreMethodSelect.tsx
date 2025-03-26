import { Form } from "react-bootstrap";
import { Results2ScoreMethod } from "../../CompetitionClassType";

interface ScoreMethodSelectProps {
    handleScoringParamsChange: Function
}

export const scoreMethodOptions = [
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_Time}`} value={Results2ScoreMethod.SingleSolo_Time}>Solo - Time</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_Cascade_WorldCup}`} value={Results2ScoreMethod.SingleSolo_Cascade_WorldCup}>Solo - Points - CascadeOC World Cup</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleTeam_Cascade_WorldCup}`} value={Results2ScoreMethod.SingleTeam_Cascade_WorldCup}>Team - Cascade - World Cup</option>
];

export function ScoreMethodSelect(props:ScoreMethodSelectProps) {

    return <Form className="mb-4">
    <Form.Label>Scoring Method</Form.Label>
    <Form.Select 
        aria-label="score method"
        onChange={(e) => props.handleScoringParamsChange(e)}>
            <option>Select a Scoring Method</option>
      {scoreMethodOptions}
    </Form.Select>
    </Form>
}