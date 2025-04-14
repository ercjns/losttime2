import { CodeCheckingStatus, CompetitiveStatus } from "../../../results/scoremethods/IofStatusParser";
import { LtScoreOResult } from "../../../shared/orienteeringtypes/LtScoreOResult";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";
import { Computed_Cascade_SingleSoloScoreOScottish1k } from "../../ComputedCompetitionClass/Computed_Cascade_SingleSoloScoreOScottish1k";
import { CompetitionClass } from "../CompetitionClass";
import { SingleRaceSoloScoreOResult } from "../SingleRaceSoloScoreOResult";

export class Cascade_SingleSoloScoreOScottish1k extends CompetitionClass {

    competitionClassType = CompetitionClassType.SingleEventSolo;
    scoreMethod = Results2ScoreMethod.SingleSolo_ScoreO_Cascade_Scottish1k

    scoreMethodFriendly(): string {
        return 'Solo - ScoreO - CascadeOC Ultimate'
    }

    compute():Computed_Cascade_SingleSoloScoreOScottish1k {
        let results = this.contributingResultsFlat().flatMap(x => 
            x instanceof LtScoreOResult ? new SingleRaceSoloScoreOResult(x) : []
        )
        
        // sort by score
        results.sort(this.compareScoreOByScoreThenTime)

        // breakout early
        if (results.length === 0 ||
            (results[0].competitive !== CompetitiveStatus.COMP ||
            results[0].codeChecking !== CodeCheckingStatus.FIN)) {
            console.log("Nothing here is valid:")
            console.log(`results: ${results.length}`)
            if (results.length > 0) {
                console.log(`status for first: ${results[0].competitive}, ${results[0].codeChecking}`)
            }
            return new Computed_Cascade_SingleSoloScoreOScottish1k(this.id, this.name, results);
        }

        //assign points
        const bestScore = results[0].score
        const bestTimeForBestScore = results[0].time
        const worstTimeForBestScore = results
            .filter(x=>x.score===bestScore && x.competitive===CompetitiveStatus.COMP)
            .reduce((maxTime,r)=>r.time > maxTime ? r.time : maxTime, bestTimeForBestScore)
        results.forEach(x => this.assignPoints(bestScore, bestTimeForBestScore, worstTimeForBestScore, x));

        // assign places
        results.forEach(this.assignPlace)

        return new Computed_Cascade_SingleSoloScoreOScottish1k(this.id, this.name, results)
    }

    private assignPoints(bestScore:number, bestTimeForBestScore:number, worstTimeForBestScore:number, r:SingleRaceSoloScoreOResult): void {
        switch (r.competitive) {
            case CompetitiveStatus.NC:
            case CompetitiveStatus.DSQ:
                break;
            case CompetitiveStatus.OVT:
            case CompetitiveStatus.SWD:
                r.points = 0;
                break;
            case CompetitiveStatus.COMP:
                if (r.codeChecking === CodeCheckingStatus.FIN) {
                    r.points = CascadeScoreOScottish1kPoints(bestScore, bestTimeForBestScore, worstTimeForBestScore, r.score, r.time)
                } else {
                    r.points = 0;
                }
        }
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

function CascadeScoreOScottish1kPoints(bestScore:number, bestTimeForBestScore:number, worstTimeForBestScore:number, score:number, time:number): number {
    if (score === bestScore) {
        return Math.round(bestTimeForBestScore / time * 1000)
    } else {
        const worstPointsForBestScore = Math.round(bestTimeForBestScore / worstTimeForBestScore * 1000)
        return Math.round(score / bestScore * worstPointsForBestScore)
    }
}