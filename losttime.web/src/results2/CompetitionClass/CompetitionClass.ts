import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";
import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { CompetitionClassType } from "../CompetitionClassType";

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

    abstract competitionClassType: CompetitionClassType
    abstract scoreMethodFriendly(): string
    abstract scoreMethodEnumValue(): number
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

    contributingNames(): {race:string, class:string}[] {
        let names:{race:string, class:string}[] = []
        this.contributingResults.forEach(raceClass => {
            names.push({race:raceClass.race_name, class:raceClass.xmlClass.Name})
        });
        return names;
    }


    //contributingresultsbyrace()
    //

}