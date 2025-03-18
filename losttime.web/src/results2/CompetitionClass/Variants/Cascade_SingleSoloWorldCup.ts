import { CompetitionClass } from "../CompetitionClass";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { Computed_Cascade_SingleSoloPointed } from "../../ComputedCompetitionClass/Computed_Cascade_SingleSoloPointed";
import { compareSingleSoloByTime } from "../SingleRaceSoloResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../../results/scoremethods/IofStatusParser";
import { SingleRaceSoloPointedResult } from "../SingleRaceSoloPointedResult";
import { IndividualScoreMethod } from "../../../results/CompetitionClass";
import { CompetitionClassType } from "../../CompetitionClassType";


export class Cascade_SingleSoloWorldCup extends CompetitionClass {
    constructor(
        name: string,
        contributingResults: StandardRaceClassData[]
    ) {
        super(name, contributingResults)
    }

    competitionClassType = CompetitionClassType.SingleEventSolo;
    
    scoreMethodFriendly(): string {
        return 'Solo - Points - CascadeOC World Cup'
    }
    scoreMethodEnumValue(): number {
        return IndividualScoreMethod.PointsCocWorldCup.valueOf()
    }

    compute():Computed_Cascade_SingleSoloPointed {
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

        return new Computed_Cascade_SingleSoloPointed(this.id, this.name, results);
    }

    private assignPlace(
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

    private assignPoints(item:SingleRaceSoloPointedResult): void {
        if (item.place === undefined || item.place === null) {
            switch (item.competitive) {
                case CompetitiveStatus.NC:
                case CompetitiveStatus.DSQ:
                    item.points = null;
                    break;
                case CompetitiveStatus.COMP:
                case CompetitiveStatus.OVT:
                case CompetitiveStatus.SWD:
                    item.points = 0;
                    break;
            }
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