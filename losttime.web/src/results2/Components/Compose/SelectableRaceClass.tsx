import { ToggleButton } from "react-bootstrap";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersSlash } from "@fortawesome/free-solid-svg-icons";


interface SelectableRaceClassProps {
    raceClass: StandardRaceClassData
    checked: boolean
    skipChecked: boolean
    onChange: Function
    onSkipChange: Function
}

export function SelectableRaceClass(props:SelectableRaceClassProps) {
    return <div>
    <ToggleButton
        id={props.raceClass.id.toString().concat("-toggle")}
        type="checkbox"
        variant={(props.skipChecked) ? "outline-secondary" : "outline-dark"}
        style={{textDecoration: props.skipChecked ? "line-through" : ""}}
        size="sm"
        checked={props.checked}
        value={props.raceClass.id.toString()}
        onChange={(e) => props.onChange(e)}
    >
    {props.raceClass.class.name} - {props.raceClass.results.length}
    </ToggleButton>
    <ToggleButton
        id={props.raceClass.id.toString().concat("-skiptoggle")}
        type="checkbox"
        variant="outline-danger"
        size="sm"
        hidden={!props.checked}
        checked={props.skipChecked}
        value={props.raceClass.id.toString()}
        onChange={(e) => props.onSkipChange(e)}
    >
    <FontAwesomeIcon icon={faUsersSlash} />
  </ToggleButton>
  </div>
}