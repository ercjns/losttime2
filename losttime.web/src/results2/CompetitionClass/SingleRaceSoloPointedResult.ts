import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { SingleRaceSoloResult } from "./SingleRaceSoloResult";

export class SingleRaceSoloPointedResult extends SingleRaceSoloResult {
    points: number | null | undefined;

    constructor(personResult: PersonResult) {
        super(personResult);
    }

}

// this is not used? This feels like possibly wrong place for this
// anything pointed has to have its own compare because this class doesn't know if 
// the best points are high or low.
// things like this should be in the CompeitionClassDefinitionVariants
export function compareSingleSoloPointedByPoints(a:SingleRaceSoloPointedResult, b:SingleRaceSoloPointedResult) {
    if (a.points && b.points) {
        return b.points - a.points;
    }
    if (a.points) {
        return 1;
    } else if (b.points) {
        return -1;
    } else {
        return 0;
    }
}