import { TeamInfo } from "../../shared/orienteeringtypes/TeamInfo";
import { SingleRaceTeamResult } from "./SingleRaceTeamResult";

class ManyRaceTeamResultsSummaryItem {
    // TODO: Make a common ManyRaceResultsSummaryItem parent across
    // solo and team series results
    hasResult:boolean
    isContributing:boolean
    points?:number
    place?:number

    constructor(r:SingleRaceTeamResult|undefined) {
        if (r === undefined) {
            this.hasResult = false;
            this.isContributing = false;
        } else {
            this.hasResult = true;
            this.isContributing = false;
            this.points = r.points
            this.place = r.place
        }
    }
}

export class ManyRaceTeamResult {
    raceResults: (SingleRaceTeamResult|undefined)[];
    resultsSummary: ManyRaceTeamResultsSummaryItem[];
    teamInfo: TeamInfo
    place?: number;
    points?: number;
    

    constructor(singleRaceResults: (SingleRaceTeamResult|undefined)[]) {
        this.raceResults = singleRaceResults
        this.resultsSummary = this.raceResults.map((x)=>new ManyRaceTeamResultsSummaryItem(x))
        this.teamInfo = this.getTeamInfo()
    }

    // Move some render helpers here so that they can be re-used across different 
    // computed competition classes that use the same result variants.
    static getTeamClub = (r:ManyRaceTeamResult):string => `${r.teamInfo.teamName} (${r.teamInfo.clubCode})`
    static getPlace = (r:ManyRaceTeamResult):string => `${r.place ?? ""}`
    static getPoints = (r:ManyRaceTeamResult):string => `${r.points ?? ""}`

    private getTeamInfo():TeamInfo {
        return this.raceResults.find(r => r?.teamInfo)!.teamInfo
    }
}