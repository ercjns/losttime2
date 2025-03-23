import { Form } from "react-bootstrap";
import { Results2ScoreMethod } from "../../CompetitionClassType";

interface ScoreMethodSelectProps {
    handleScoringParamsChange: Function
}

export function ScoreMethodSelect(props:ScoreMethodSelectProps) {

    const scoreMethodOptions = Object.keys(Results2ScoreMethod)
        .filter((v) => isNaN(Number(v)))
        .map((name) =>
            <option key={`${name}-score-method-option`} value={Results2ScoreMethod[name as keyof typeof Results2ScoreMethod]}>{name}</option>
    );

    return <Form>
    <Form.Label>Scoring Method</Form.Label>
    <Form.Select 
        aria-label="score method"
        onChange={(e) => props.handleScoringParamsChange(e)}>
            <option>Select a Scoring Method</option>
      {scoreMethodOptions}
    </Form.Select>
    </Form>
}