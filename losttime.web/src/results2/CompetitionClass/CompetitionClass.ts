import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { CompetitionClassType, Results2ScoreMethod } from "../CompetitionClassType";
import { LtResult } from "../../shared/orienteeringtypes/LtResult";
import { LtScoreOResult } from "../../shared/orienteeringtypes/LtScoreOResult";

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
    abstract scoreMethod: Results2ScoreMethod
    abstract scoreMethodFriendly(): string
    abstract compute(): ComputedCompetitionClass

    // helpers for process actions go here
    // but ONLY if they are relevant to all Result types

    contributingResultsFlat(): (LtResult|LtScoreOResult)[] {
        let results:(LtResult|LtScoreOResult)[] = []
        for (const race of this.contributingResults) {
            if (race.results.length === undefined) {continue;}
            results.push(...race.results)
        }
        return results
    }

}