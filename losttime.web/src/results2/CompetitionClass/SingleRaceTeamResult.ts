import { TeamInfo } from "../../shared/orienteeringtypes/TeamInfo"
import { SingleRaceSoloResult } from "./SingleRaceSoloResult"

export class SingleRaceTeamResult {
    teamInfo: TeamInfo
    soloResultsAll: SingleRaceSoloResult[]
    soloResults: SingleRaceSoloResult[]
    place?: number
    points?: number

    constructor(results:SingleRaceSoloResult[], name:string, clubCode?:string) {
        // refactor team info further upstream?
        this.teamInfo = new TeamInfo(name, clubCode)
        this.soloResultsAll = results

        this.soloResults = []
    }

    static getTeamClub = (r:SingleRaceTeamResult):string => `${r.teamInfo.teamName} (${r.teamInfo.clubCode})`
}

export const isSingleRaceTeamResult = (x: SingleRaceTeamResult | undefined): x is SingleRaceTeamResult => !!x;

export function compareSingleTeamByPointsHighestFirst(a:SingleRaceTeamResult, b:SingleRaceTeamResult) {
    if (a.points && b.points) {
        return b.points - a.points;
    }
    if (a.points) {
        return -1;
    } else if (b.points) {
        return 1;
    } else {
        return 0;
    }
}