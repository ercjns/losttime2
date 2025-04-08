import { CompetitionClass } from "../CompetitionClass";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { CodeCheckingStatus, CompetitiveStatus } from "../../../results/scoremethods/IofStatusParser";
import { Computed_Ousa_SingleSoloAvgWinTime } from "../../ComputedCompetitionClass/Computed_Ousa_SingleSoloAvgWinTime";
import { SingleRaceSoloResult } from "../SingleRaceSoloResult";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";
import { LtResult } from "../../../shared/orienteeringtypes/LtResult";


export class Ousa_SingleSoloAvgWinTime extends CompetitionClass {
    consideredResults: StandardRaceClassData[];

    constructor(
        name: string,
        contributingResults: StandardRaceClassData[],
        consideredResults: StandardRaceClassData[]
    ) {
        super(name, contributingResults)
        this.consideredResults = consideredResults;
    }

    consideredResultsFlat(): LtResult[] {
        // like super.contributingResultsFlat
        let results: LtResult[] = []
        for (const race of this.consideredResults) {
            if (race.results.length === undefined) {continue;}
            results.push(...race.results);
        }
        return results
    }

    competitionClassType = CompetitionClassType.SingleEventSolo
    scoreMethod = Results2ScoreMethod.SingleSolo_Time //CHANGE ME
    scoreMethodFriendly(): string {
        return 'Solo - Points - OUSA Average Winning Time'
    }

    compute(): Computed_Ousa_SingleSoloAvgWinTime {
        // gather all Single Race Solo Results head to head
        let results = this.contributingResultsFlat().map(x =>
            new SingleRaceSoloResult(x)
        )
        let pairedResults = this.consideredResultsFlat().map(x =>
            new SingleRaceSoloResult(x)
        )

        // do AWT calcs for this class
        // do AWT calcs for paired class

        // assign points
        
        // assign places
        
        throw new Error("Not implemented");
    }

}


//from OusaAwt.tsx
function CalcAwtForClass(raceResults:SingleRaceSoloResult[]):number|undefined {
    const valids = raceResults.filter(x => x.competitive === CompetitiveStatus.COMP && x.codeChecking === CodeCheckingStatus.FIN && x.time)

    if (!valids || !valids.length) {
        return undefined;
    }

    valids.sort((a,b) => a.time - b.time)

    let topFinishers:SingleRaceSoloResult[] = [];
    const maxToConsider:number = valids.length > 3 ? 3 : valids.length;
    topFinishers = valids.slice(0,maxToConsider);

    const theAvgWinTime = topFinishers.reduce((sum,val)=>sum+val.time, 0) / topFinishers.length;

    // console.log(theAvgWinTime);
    return theAvgWinTime;
}