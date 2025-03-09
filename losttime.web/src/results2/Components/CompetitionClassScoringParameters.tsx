import { Form } from "react-bootstrap";
import { IndividualScoreMethod } from "../../results/CompetitionClass"

interface CompetitionClassScoringParametersProps {
    handleScoringParamsChange: Function
}

export function CompetitionClassScoringParameters(props:CompetitionClassScoringParametersProps) {

    const scoreMethodOptions = Object.keys(IndividualScoreMethod)
        .filter((v) => isNaN(Number(v)))
        .map((name) =>
            <option key={`${name}-score-method-option`} value={IndividualScoreMethod[name as keyof typeof IndividualScoreMethod]}>{name}</option>
    );

    return <div>
    <Form.Label>Scoring Method</Form.Label>
    <Form.Select 
        aria-label="score method"
        onChange={(e) => props.handleScoringParamsChange(e)}>
            <option>Select a Scoring Method</option>
      {scoreMethodOptions}
    </Form.Select>
    </div>
}