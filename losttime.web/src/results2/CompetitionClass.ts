import { Guid } from "guid-typescript";
import { LtStaticRaceClassResult } from "../results/RaceResult";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { PersonResult } from "../shared/orienteeringtypes/IofResultXml";

export abstract class CompetitionClass {
    id: Guid;
    name: string;
    contributingResults: LtStaticRaceClassResult[];

    constructor(
        name: string,
        contributingResults: LtStaticRaceClassResult[]
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
            if (race.PersonResults.length === undefined) {continue;}
            results.push(...race.PersonResults);
        }
        return results
    }

    //contributingresultsbyrace()
    //

}