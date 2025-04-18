import { ToggleButton } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";


interface SelectableRaceClassProps {
    raceClass: StandardRaceClassData
    checked: boolean
    onChange: Function
}

export function SelectableRaceClass(props:SelectableRaceClassProps) {
    return <ToggleButton
        id={props.raceClass.id.toString().concat("-toggle")}
        type="checkbox"
        variant="outline-dark"
        size="sm"
        checked={props.checked}
        value={props.raceClass.id.toString()}
        onChange={(e) => props.onChange(e)}
    >
    {props.raceClass.class.name} - {props.raceClass.results.length} Results
  </ToggleButton>
}