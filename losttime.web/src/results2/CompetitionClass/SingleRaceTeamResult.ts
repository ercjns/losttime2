import { SingleRaceSoloPointedResult } from "./SingleRaceSoloPointedResult"

export class SingleRaceTeamResult {
    teamName: string
    club?: string
    soloResultsAll: SingleRaceSoloPointedResult[]
    soloResults: SingleRaceSoloPointedResult[]
    place: number | null | undefined
    points: number | null | undefined
    isValid: boolean

    constructor(results:SingleRaceSoloPointedResult[], name:string, club?:string, ) {
        this.teamName = name;
        this.club = club;
        this.soloResultsAll = results

        this.soloResults = []
        this.isValid = false
    }
}