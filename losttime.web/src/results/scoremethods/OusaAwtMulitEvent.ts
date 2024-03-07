
import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";

class MultiEventResult {
    Raw: PersonResult[];
    Name: string;
    Club?: string;
    Points?: number;
    Place?: number;
    isValid?: boolean;

    constructor(raceResults:PersonResult[]) {
        if (raceResults.length === 0) {
            this.Raw = [];
            this.Name = "";
            this.isValid = false;
            return;
        }
        const firstResult = raceResults[0];
        this.Raw = raceResults;
        this.Name = (firstResult.Person.Name.Given + " " + firstResult.Person.Name.Family).trim();
        return;
    }
}