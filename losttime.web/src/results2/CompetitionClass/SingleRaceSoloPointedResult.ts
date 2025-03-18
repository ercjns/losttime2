import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { SingleRaceSoloResult } from "./SingleRaceSoloResult";

export class SingleRaceSoloPointedResult extends SingleRaceSoloResult {
    points: number | null | undefined;

    constructor(personResult: PersonResult) {
        super(personResult);
    }

}