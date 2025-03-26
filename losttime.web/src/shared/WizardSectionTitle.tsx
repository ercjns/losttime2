import { faCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface WizardSectionTitleProps {
    title: string
    showLine: boolean
    icon: "arrow" | "check" | "none" | undefined
}

export function WizardSectionTitle(props:WizardSectionTitleProps) {

    const line = (props.showLine) ?
    <div style={{
      width: '100%',
      height: '2px',
      backgroundColor: 'magenta',
      marginTop: '10px',
      marginBottom: '10px'
      }}></div>
      :
    <div></div>;

    let leadIcon = <span/>;

    if (props.icon === "arrow") {
        leadIcon = <FontAwesomeIcon icon={faCircleRight} style={{color: 'magenta'}} />
    } else if (props.icon === "check") {
        leadIcon = <FontAwesomeIcon icon={faCircleCheck} style={{color: 'green'}} />
    }

    return (
        <div>
        {line}
        <h3>
            {leadIcon} {props.title}
        </h3>
        </div>
      );
}
