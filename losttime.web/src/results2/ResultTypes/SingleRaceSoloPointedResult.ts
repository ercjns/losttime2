import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { SingleRaceSoloResult } from "./SingleRaceSoloResult";

export class SingleRaceSoloPointedResult extends SingleRaceSoloResult {
    points: number | null | undefined;

    constructor(personResult: PersonResult) {
        super(personResult);
    }

}

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