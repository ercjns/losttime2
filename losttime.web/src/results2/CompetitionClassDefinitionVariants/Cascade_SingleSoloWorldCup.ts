import { CompetitionClass } from "../CompetitionClass";
import { LtStaticRaceClassResult } from "../../results/RaceResult";
import { Computed_Cascade_SingleSoloWorldCup } from "../ComputedCompetitionClassVariants/Computed_Cascade_SingleSoloWorldCup";
import { compareSingleSoloByTime } from "../ResultTypes/SingleRaceSoloResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../results/scoremethods/IofStatusParser";
import { SingleRaceSoloPointedResult } from "../ResultTypes/SingleRaceSoloPointedResult";

class Cascade_SingleSoloWorldCup extends CompetitionClass {
    constructor(
        name: string,
        contributingResults: LtStaticRaceClassResult[]
    ) {
        super(name, contributingResults)
    }

    compute():Computed_Cascade_SingleSoloWorldCup {
        // gather all Single Race Solo Results head to head
        let results = this.contributingResultsFlat().map(x =>
            new SingleRaceSoloPointedResult(x)
        )

        // order by time
        results.sort(compareSingleSoloByTime);

        // assign places
        results.forEach(this.assignPlace);

        // assign points
        results.forEach(this.assignPoints);

        return new Computed_Cascade_SingleSoloWorldCup(this.id, this.name, results);
    }

    assignPlace(
        item:SingleRaceSoloPointedResult, 
        index:number, 
        results:SingleRaceSoloPointedResult[]
    ): void {
        // no place for NC/DSQ/SPW/
        if (item.competitive !== CompetitiveStatus.COMP) {
            item.place = null;
        // no place for MSP/DNF/UNK 
        } else if (item.codeChecking !== CodeCheckingStatus.FIN) {
            item.place = null;
        // COMP and FIN
        } else {
            if (index === 0) {
                item.place = 1
            }
            else {
                if (compareSingleSoloByTime(item, results[index-1]) === 0) {
                    item.place = results[index-1].place;
                }
                else {
                    item.place = index + 1;
                }
            }
        }
    }

    assignPoints(item:SingleRaceSoloPointedResult): void {
        if (item.place === undefined || item.place === null) {
            item.points = null;
        } else {
            item.points = CascadeWorldCupScoreByPlace(item.place);
        }
    }
}

function CascadeWorldCupScoreByPlace(place:number):number {
    if (place === 1) {return 100;}
    else if (place === 2) {return 95;}
    else if (place === 3) {return 92;}
    else {
        return place <= 94 ? 94-place : 0;
    }
}