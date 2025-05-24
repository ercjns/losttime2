import { LtPerson } from "./LtPerson"
import { LtResult } from "./LtResult"

interface LtScoreOResultParams {
    person: LtPerson
    bib?: string
    card?: string
    start?: string
    finish?: string
    time: number
    status: string
    position?: number
    scoreRaw: number;
    penalty?: number; // always positive
    bonus?: number;
    score?: number // pointsRaw - penalty + bonus = score

}

export class LtScoreOResult extends LtResult {
    scoreRaw: number;
    penalty: number; // always positive
    bonus: number;
    score: number // pointsRaw - penalty + bonus = score

    constructor(params: LtScoreOResultParams)
     {
        super(params)
        this.scoreRaw = params.scoreRaw
        this.penalty = params.penalty? Math.abs(params.penalty) : 0
        this.bonus = params.bonus? Math.abs(params.bonus) : 0
        if (params.score) {
            const calcScore:number = params.scoreRaw - this.penalty + this.bonus
            if (params.score != calcScore) {
                console.log(`ISSUE! ${params.score} != ${params.scoreRaw}-${this.penalty}+${this.bonus} = ${calcScore}`)
                Error("Math is wrong somewhere!")
            }
            this.score = params.score
        } else {
            this.score = params.scoreRaw - this.penalty + this.bonus
        }
    }
}