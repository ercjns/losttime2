import { LtPerson } from "../../shared/orienteeringtypes/LtPerson";
import { SingleRaceSoloResult } from "./SingleRaceSoloResult";

class SoloManyResultsSummary {
    hasResult:boolean
    isContributing:boolean
    time?:number
    points?:number
    place?:number

    constructor(r:SingleRaceSoloResult|undefined) {
        if (r === undefined) {
            this.hasResult = false;
            this.isContributing = false;
        } else {
            this.hasResult = true;
            this.isContributing = false;
            this.time = r.time
            this.points = r.points
            this.place = r.place
        }
    }
}

export class ManyRaceSoloResult {
    raceResults: (SingleRaceSoloResult|undefined)[];
    resultsSummary: SoloManyResultsSummary[];
    person: LtPerson;
    place?: number;
    time?: number;
    points?: number;
    

    constructor(singleRaceResults: (SingleRaceSoloResult|undefined)[]) {
        this.raceResults = singleRaceResults
        this.resultsSummary = this.raceResults.map((x)=>new SoloManyResultsSummary(x))
        this.person = this.getPerson()
    }

    // Move some render helpers here so that they can be re-used across different 
    // computed competition classes that use the same result variants.
    static getPlace = (r:ManyRaceSoloResult):string => `${r.place ?? ""}`
    static getNameClub = (r:ManyRaceSoloResult):string => `${(r.person.first + " " + r.person.last).trim()} (${r.person.clubCode})`
    static getName = (r:ManyRaceSoloResult):string => `${(r.person.first + " " + r.person.last).trim()}`
    static getClubCode = (r:ManyRaceSoloResult):string => `${r.person.clubCode}`
    static getTimeMMMSS = (r:ManyRaceSoloResult):string => `${ManyRaceSoloResult.timeNumberAsMMMSS(r.time)}`
    static getPoints = (r:ManyRaceSoloResult):string => `${r.points ?? ""}`

    static timeNumberAsMMMSS(time:number|undefined) {
        if (time === undefined) {return ""}
        const mins = Math.floor(time / 60)
        const secs = time % 60;
        return mins.toString() + ":" + secs.toString().padStart(2, "0");
    }

    private getPerson():LtPerson {
        return this.raceResults.find(r => r?.person)!.person
    }
}