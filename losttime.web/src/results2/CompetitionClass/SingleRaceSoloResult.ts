import { CodeCheckingStatus, CompetitiveStatus } from "../../results/scoremethods/IofStatusParser";
import { LtPerson } from "../../shared/orienteeringtypes/LtPerson";
import { LtResult } from "../../shared/orienteeringtypes/LtResult";

export class SingleRaceSoloResult {
    person: LtPerson
    time: number; // TODO: HANDLE UNDEFINED TIME??
    place: number | null | undefined;
    codeChecking: CodeCheckingStatus;
    competitive: CompetitiveStatus;
    points?: number

    constructor(ltResult: LtResult) {
        this.person = ltResult.person
        this.time = ltResult.time
        this.place = ltResult.position
        this.codeChecking = ltResult.codeCheckStatus
        this.competitive = ltResult.competeStatus
    }

    // Move some render helpers here so that they can be re-used across different 
    // computed competition classes that use the same result variants.
    static getPlace = (r:SingleRaceSoloResult):string => `${r.place ?? ""}`
    static getNameClub = (r:SingleRaceSoloResult):string => `${(r.person.first + " " + r.person.last).trim()} (${r.person.clubCode})`
    static getName = (r:SingleRaceSoloResult):string => `${(r.person.first + " " + r.person.last).trim()}`
    static getClubCode = (r:SingleRaceSoloResult):string => `${r.person.clubCode}`
    static getTimeMMMSS = (r:SingleRaceSoloResult):string => `${SingleRaceSoloResult.timeNumberAsMMMSS(r.time)}`
    static getTimeWithStatus = (r:SingleRaceSoloResult):string => {
        if (r.codeChecking === CodeCheckingStatus.FIN && r.competitive === CompetitiveStatus.COMP) {
               return `${SingleRaceSoloResult.timeNumberAsMMMSS(r.time)}`;
       } else if (r.codeChecking !== CodeCheckingStatus.UNK) {
           return `${CodeCheckingStatus[r.codeChecking]} ${SingleRaceSoloResult.timeNumberAsMMMSS(r.time)}`
       } else {
           return `${CompetitiveStatus[r.competitive]} ${SingleRaceSoloResult.timeNumberAsMMMSS(r.time)}*`
       }
    }
    static getPoints = (r:SingleRaceSoloResult):string => `${r.points ?? ""}`

    static timeNumberAsMMMSS(time:number|undefined) {
        if (time === undefined) {return "--:--"}
        const mins = Math.floor(time / 60)
        const secs = time % 60;
        return mins.toString() + ":" + secs.toString().padStart(2, "0");
    }

}

// This feels ok because it *should* be generic enough, but be careful!
export function compareSingleSoloByTime(a:SingleRaceSoloResult, b:SingleRaceSoloResult):number {
    if (a.competitive !== b.competitive) {
        return a.competitive - b.competitive;
    }
    if (a.codeChecking !== b.codeChecking) {
        return a.codeChecking - b.codeChecking;
    }
    if (a.time && b.time) {
        return a.time - b.time;
    }
    if (a.time) {
        return -1;
    } else if (b.time) {
        return 1;
    } else {
        return 0;
    }
}

export const isSingleRaceSoloResult = (x: SingleRaceSoloResult | undefined): x is SingleRaceSoloResult => !!x;

export function compareSingleSoloPointedByPointsHighestFirst(a:SingleRaceSoloResult, b:SingleRaceSoloResult) {
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