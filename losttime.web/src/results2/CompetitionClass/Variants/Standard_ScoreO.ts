import { CodeCheckingStatus, CompetitiveStatus } from "../../../shared/orienteeringtypes/RaceStatuses";
import { LtScoreOResult } from "../../../shared/orienteeringtypes/LtScoreOResult";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";
import { Computed_Standard_ScoreO } from "../../ComputedCompetitionClass/Computed_Standard_ScoreO";
import { CompetitionClass } from "../CompetitionClass";
import { SingleRaceSoloScoreOResult } from "../SingleRaceSoloScoreOResult";

export class Standard_ScoreO extends CompetitionClass {

    competitionClassType = CompetitionClassType.SingleEventSolo;
    scoreMethod = Results2ScoreMethod.SingleSolo_ScoreO

    scoreMethodFriendly(): string {
        return 'Solo - ScoreO'
    }

    compute():Computed_Standard_ScoreO {
        let results = this.contributingResultsFlat().flatMap(x => 
            x instanceof LtScoreOResult ? new SingleRaceSoloScoreOResult(x) : []
        )
        
        // sort by score
        results.sort(this.compareScoreOByScoreThenTime)

        // breakout early
        if (results.length === 0 ||
            (results[0].competitive !== CompetitiveStatus.COMP ||
            results[0].codeChecking !== CodeCheckingStatus.FIN)) {
            return new Computed_Standard_ScoreO(this.id, this.name, results);
        }

        // assign places
        results.forEach(this.assignPlace)

        return new Computed_Standard_ScoreO(this.id, this.name, results)
    }

    private assignPlace(
        r:SingleRaceSoloScoreOResult, 
        index:number, 
        results:SingleRaceSoloScoreOResult[]
    ): void {
        // no place for NC/DSQ/SPW/
        if (r.competitive !== CompetitiveStatus.COMP) {
            return
        // no place for MSP/DNF/UNK 
        } else if (r.codeChecking !== CodeCheckingStatus.FIN) {
            return
        } else {
            if (index === 0) {
                r.place = 1
            }
            else {
                if (r.score === results[index-1].score && r.time === results[index-1].time) {
                    r.place = results[index-1].place
                }
                else {
                    r.place = index + 1;
                }
            }
        }
    }

    private compareScoreOByScoreThenTime(a:SingleRaceSoloScoreOResult, b:SingleRaceSoloScoreOResult): number {
        if (a.competitive !== b.competitive) {
            return a.competitive - b.competitive;
        }
        if (a.codeChecking !== b.codeChecking) {
            return a.codeChecking - b.codeChecking;
        }
        if (a.score !== b.score) {
            return b.score - a.score // reverse: higher score better
        } else {
            return a.time - b.time // shorter time better
        }

    }
}