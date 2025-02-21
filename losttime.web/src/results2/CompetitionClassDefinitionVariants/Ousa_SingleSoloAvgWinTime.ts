import { LtStaticRaceClassResult } from "../../results/RaceResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../results/scoremethods/IofStatusParser";
import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { Computed_Ousa_SingleSoloAvgWinTime } from "../ComputedCompetitionClassVariants/Computed_Ousa_SingleSoloAvgWinTime";
import { SingleRaceSoloPointedResult } from "../ResultTypes/SingleRaceSoloPointedResult";
import { CompetitionClass } from "../CompetitionClass";

class Ousa_SingleSoloAvgWinTime extends CompetitionClass {
    consideredResults: LtStaticRaceClassResult[];

    constructor(
        name: string,
        contributingResults: LtStaticRaceClassResult[],
        consideredResults: LtStaticRaceClassResult[]
    ) {
        super(name, contributingResults)
        this.consideredResults = consideredResults;
    }

    consideredResultsFlat(): PersonResult[] {
        // like super.contributingResultsFlat
        let results: PersonResult[] = []
        for (const race of this.consideredResults) {
            if (race.PersonResults.length === undefined) {continue;}
            results.push(...race.PersonResults);
        }
        return results
    }

    compute(): Computed_Ousa_SingleSoloAvgWinTime {
        // gather all Single Race Solo Results head to head
        let results = this.contributingResultsFlat().map(x =>
            new SingleRaceSoloPointedResult(x)
        )
        let pairedResults = this.consideredResultsFlat().map(x =>
            new SingleRaceSoloPointedResult(x)
        )

        // do AWT calcs for this class
        // do AWT calcs for paired class

        // assign points
        
        // assign places
        
        throw new Error("Not implemented");
    }

}


//from OusaAwt.tsx
function CalcAwtForClass(raceResults:SingleRaceSoloPointedResult[]):number|undefined {
    const valids = raceResults.filter(x => x.competitive === CompetitiveStatus.COMP && x.codeChecking === CodeCheckingStatus.FIN && x.time)

    if (!valids || !valids.length) {
        return undefined;
    }

    valids.sort((a,b) => a.time - b.time)

    let topFinishers:SingleRaceSoloPointedResult[] = [];
    const maxToConsider:number = valids.length > 3 ? 3 : valids.length;
    topFinishers = valids.slice(0,maxToConsider);

    const theAvgWinTime = topFinishers.reduce((sum,val)=>sum+val.time, 0) / topFinishers.length;

    // console.log(theAvgWinTime);
    return theAvgWinTime;
}