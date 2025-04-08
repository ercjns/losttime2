import { SingleRaceSoloResult } from "./SingleRaceSoloResult"

export class SingleRaceTeamResult {
    teamName: string
    club?: string
    soloResultsAll: SingleRaceSoloResult[]
    soloResults: SingleRaceSoloResult[]
    place: number | null | undefined
    points: number | null | undefined

    constructor(results:SingleRaceSoloResult[], name:string, club?:string, ) {
        this.teamName = name;
        this.club = club;
        this.soloResultsAll = results

        this.soloResults = []
    }

    static getPoints = (r:SingleRaceTeamResult):string =>`${r.place ?? ""}`
    static getTeamClub = (r:SingleRaceTeamResult):string => `${r.teamName} (${r.club})`
}