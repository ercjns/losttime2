import { Form } from "react-bootstrap";
import { Results2ScoreMethod } from "../../CompetitionClassType";

interface ScoreMethodSelectProps {
    handleScoringParamsChange: Function
}

export const scoreMethodOptions = [
    <option key="list-sep-standard">-- Standard --</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_Time}`} value={Results2ScoreMethod.SingleSolo_Time}>Solo - Time</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_Cascade_WorldCup}`} value={Results2ScoreMethod.SingleSolo_Cascade_WorldCup}>Solo - CascadeOC Winter</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_Cascade_Scottish1k}`} value={Results2ScoreMethod.SingleSolo_Cascade_Scottish1k}>Solo - CascadeOC Ultimate</option>,
    <option key="list-sep-scoreo">-- Score O --</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_ScoreO}`} value={Results2ScoreMethod.SingleSolo_ScoreO}>Solo - ScoreO</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleSolo_ScoreO_Cascade_Scottish1k}`} value={Results2ScoreMethod.SingleSolo_ScoreO_Cascade_Scottish1k}>Solo - ScoreO - CascadeOC Ultimate</option>,
    <option key="list-sep-team">-- Team Scoring --</option>,
    <option key={`score-option-${Results2ScoreMethod.SingleTeam_Cascade_WorldCup}`} value={Results2ScoreMethod.SingleTeam_Cascade_WorldCup}>Team - Cascade - Winter</option>,
    <option key="list-sep-series">-- Multi-Event and Series Scoring --</option>,
    <option key={`score-option-${Results2ScoreMethod.ManySolo_Cascade_WorldCup}`} value={Results2ScoreMethod.ManySolo_Cascade_WorldCup}>Series - Solo - Cascade - Winter</option>
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