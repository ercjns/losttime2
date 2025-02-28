import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { PersonResult } from "../shared/orienteeringtypes/IofResultXml";
import { StandardRaceClassData } from "./StandardRaceClassData";

export abstract class CompetitionClass {
    id: Guid;
    name: string;
    contributingResults: StandardRaceClassData[];

    constructor(
        name: string,
        contributingResults: StandardRaceClassData[]
    ) {
        this.id = Guid.create();
        this.name = name;
        this.contributingResults = contributingResults;
    }

    abstract compute(): ComputedCompetitionClass

    // helpers for process actions go here
    // but ONLY if they are relevant to all Result types

    contributingResultsFlat(): PersonResult[] {
        let results: PersonResult[] = []
        for (const race of this.contributingResults) {
            if (race.xmlPersonResults.length === undefined) {continue;}
            results.push(...race.xmlPersonResults);
        }
        return results
    }

    //contributingresultsbyrace()
    //

}