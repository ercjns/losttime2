import { CompetitionClass } from "../CompetitionClass";
import { LtStaticRaceClassResult } from "../../results/RaceResult";
import { Computed_Standard_Time } from "../ComputedCompetitionClassVariants/Computed_Standard_Time";
import { compareSingleSoloByTime, SingleRaceSoloResult } from "../ResultTypes/SingleRaceSoloResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../results/scoremethods/IofStatusParser";

class Standard_Time extends CompetitionClass {
    constructor(
        name: string,
        contributingResults: LtStaticRaceClassResult[]
    ) {
        super(name, contributingResults)
    }

    compute():Computed_Standard_Time {
        // gather all Single Race Solo Results head to head
        let results = this.contributingResultsFlat().map(x =>
            new SingleRaceSoloResult(x)
        )

        // order by time
        results.sort(compareSingleSoloByTime);

        // assign places
        results.forEach(this.assignPlace);

        return new Computed_Standard_Time(this.id, this.name, results);
    }

    assignPlace(
        item:SingleRaceSoloResult, 
        index:number, 
        results:SingleRaceSoloResult[]
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

}
