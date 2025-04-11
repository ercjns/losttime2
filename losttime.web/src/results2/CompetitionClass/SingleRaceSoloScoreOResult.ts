import { LtScoreOResult } from "../../shared/orienteeringtypes/LtScoreOResult";
import { SingleRaceSoloResult } from "./SingleRaceSoloResult";

export class SingleRaceSoloScoreOResult extends SingleRaceSoloResult {
    scoreRaw: number;
    penalty: number; // always positive
    bonus: number;
    score: number // pointsRaw - penalty + bonus = score

    constructor(ltResult:LtScoreOResult) {
        super(ltResult)
        this.scoreRaw = ltResult.scoreRaw
        this.penalty = ltResult.penalty
        this.bonus = ltResult.bonus
        this.score = ltResult.score
    }

    static getRawScore = (r:SingleRaceSoloScoreOResult):string => `${r.scoreRaw}`
    static getPenalty = (r:SingleRaceSoloScoreOResult):string => `${r.penalty?? ""}`
    static getFinalScore = (r:SingleRaceSoloScoreOResult):string => `${r.score}`

}