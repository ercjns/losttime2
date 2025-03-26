import { CompetitionClass } from "../CompetitionClass";
import { Computed_Cascade_SingleSoloPointed } from "../../ComputedCompetitionClass/Computed_Cascade_SingleSoloPointed";
import { compareSingleSoloByTime } from "../SingleRaceSoloResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../../results/scoremethods/IofStatusParser";
import { SingleRaceSoloPointedResult } from "../SingleRaceSoloPointedResult";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";


export class Cascade_SingleSoloScottish1k extends CompetitionClass {

    competitionClassType = CompetitionClassType.SingleEventSolo;
    scoreMethod = Results2ScoreMethod.SingleSolo_Cascade_Scottish1k

    scoreMethodFriendly(): string {
        return 'Solo - Points - CascadeOC 1000 Ratio to Winner'
    }

    compute():Computed_Cascade_SingleSoloPointed {
        // gather all Single Race Solo Results head to head
        let results = this.contributingResultsFlat().map(x =>
            new SingleRaceSoloPointedResult(x)
        )

        if (results.length === 0 || 
            (results[0].competitive !== CompetitiveStatus.COMP ||
            results[0].codeChecking !== CodeCheckingStatus.FIN)) {
            return new Computed_Cascade_SingleSoloPointed(this.id, this.name, results);
        }

        // order by time
        results.sort(compareSingleSoloByTime);

        // assign points
        const bestTime = results[0].time
        results.forEach((x) => this.assignPoints(bestTime, x));
        
        // assign places
        results.forEach(this.assignPlace);

        return new Computed_Cascade_SingleSoloPointed(this.id, this.name, results);
    }

    assignPoints(bestTime:number, item:SingleRaceSoloPointedResult): void {
        switch (item.competitive) {
            case CompetitiveStatus.NC:
            case CompetitiveStatus.DSQ:
                item.points = null;
                break;
            case CompetitiveStatus.OVT:
            case CompetitiveStatus.SWD:
                item.points = 0;
                break;
            case CompetitiveStatus.COMP:
                if (item.codeChecking === CodeCheckingStatus.FIN) {
                    item.points = CascadeScottish1kPoints(bestTime, item.time)
                } else {
                    item.points = 0;
                }
        }
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
                if (compareScottish1kPoints(item, results[index-1]) === 0) {
                    item.place = results[index-1].place;
                }
                else {
                    item.place = index + 1;
                }
            }
        }
    }
}

function CascadeScottish1kPoints(bestTime:number, thisTime:number):number {
    return Math.round(bestTime / thisTime * 1000)
}

function compareScottish1kPoints(a:SingleRaceSoloPointedResult, b:SingleRaceSoloPointedResult):number {
    if (a.competitive !== b.competitive) {
        return a.competitive - b.competitive;
    }
    if (a.codeChecking !== b.codeChecking) {
        return a.codeChecking - b.codeChecking;
    }
    if (a.points && b.points) {
        // b - a because higher points rank first.
        return b.points - a.points; 
        // TODO: clarify tiebreak. Is placement points ONLY or points AND time?
        // example: time is 2 seconds different but points are the same.
        // is this a tie, or is placement different for these even though
        // their points are the same?
    }
    if (a.points) {
        return -1;
    } else if (b.points) {
        return 1;
    } else {
        return 0;
    }
}