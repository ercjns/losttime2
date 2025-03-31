import { CodeCheckingStatus, CompetitiveStatus, iofStatusParser } from "../../results/scoremethods/IofStatusParser"
import { LtPerson } from "./LtPerson"

interface LtResultParams {
    person: LtPerson
    bib?: string
    card?: string
    start?: string
    finish?: string
    time: number
    status: string
    position?: number
}

export class LtResult {
    person: LtPerson
    bib?: string
    card?: string
    start?: string
    finish?: string
    time: number
    competeStatus: CompetitiveStatus
    codeCheckStatus: CodeCheckingStatus
    position?: number

    constructor(params: LtResultParams)
     {
        this.person = params.person
        this.bib = params.bib
        this.card = params.card
        this.start = params.start
        this.finish = params.finish
        this.time = params.time
        this.competeStatus = iofStatusParser(params.status).CompetitiveStatus
        this.codeCheckStatus = iofStatusParser(params.status).CodeCheckingStatus
        this.position = params.position

    }
}