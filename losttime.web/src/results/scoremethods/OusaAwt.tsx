// a. For each Individual Intercollegiate/Interscholastic class, define AWT (the average winning time) as the average of the
// times of the top three individual competitors in that class (for Championships use only times from Team
// Championship-eligible competitors). In the event that there are fewer than three eligible competitors with a
// valid time in any intercollegiate class, the AWT shall be calculated as the average of the times of all
// eligible competitors with a valid time.

// b. For each competitor in each Individual Intercollegiate/Interscholastic class with a valid result, their score is computed as
// 60*(competitor’s time)/ (AWT for the class).

// c. For competitors with an OVT, MSP, DNF or DSQ result, their score shall be the larger of 10+[60*(course
// time limit)/ (AWT for the male class)] and 10+[60*(course time limit)/ (AWT for the female class)] for
// their team level (Varsity, JV, Intermediate, or Primary).

import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { LtStaticRaceClassResult } from "../RaceResult";
import { CodeCheckingStatus, CompetitiveStatus, iofStatusParser } from "./IofStatusParser";

export class OusaAvgWinTimeResult {
    Raw: PersonResult;
    Name: string;
    Club?: string;
    Time?: number;
    Points?: number;
    Place?: number;
    CodeCheckingStatus!: CodeCheckingStatus;
    CompetitiveStatus!: CompetitiveStatus;

    constructor(raceResult:PersonResult) {
        this.Raw = raceResult;
        this.Name = (raceResult.Person.Name.Given + " " + raceResult.Person.Name.Family).trim();
        this.Club = raceResult.Organisation.ShortName;
        this.Time = raceResult.Result.Time;
        const statuses = iofStatusParser(this.Raw.Result.Status)
        this.CodeCheckingStatus = statuses.CodeCheckingStatus;
        this.CompetitiveStatus = statuses.CompetitiveStatus;
    }
}


export function OusaAvgWinTimeScoring_Indv(
    raceResults:LtStaticRaceClassResult[],
    pairedRaceResults:LtStaticRaceClassResult[]=[]
    ):OusaAvgWinTimeResult[] {
    
    // transform into native type
    let results: OusaAvgWinTimeResult[] = []
    for (const race of raceResults) {
        if (race.PersonResults.length === undefined) {continue;}
        results.push(...race.PersonResults.map(x => new OusaAvgWinTimeResult(x)))
    }

    let pairedResults: OusaAvgWinTimeResult[] = []
    for (const race of pairedRaceResults) {
        if (race.PersonResults.length === undefined) {continue;}
        pairedResults.push(...race.PersonResults.map(x => new OusaAvgWinTimeResult(x)))
    }

    // Calulate the AWT for this class and the paired class
    const classAWT = CalcAwtForClass(results);
    let pairedClassAWT = CalcAwtForClass(pairedResults)

    if (!classAWT) {
        // no valid results, so just return what we've got so far
        return results;
    } else if (!pairedClassAWT) {
        // no paired results, continue as if there's no paired class
        pairedClassAWT = classAWT;
    }

    // HARD CODE THREE HOURS TIME LIMIT
    // THIS NEEDS TO BE CONFIGURABLE
    const TIME_LIMIT = 60*60*3;

    // invalid results scored as larger of:
    //     10+[60*(course time limit)/ (AWT for the male class)] 
    //     10+[60*(course time limit)/ (AWT for the female class)]
    const thisClassInvalidScore = 10 + (60 * TIME_LIMIT / classAWT)
    const otherClassInvalidScore = 10 + (60 * TIME_LIMIT / pairedClassAWT)
    const invalidResultScore = Math.max(thisClassInvalidScore, otherClassInvalidScore)

    // Assign points to competitors
    //     60*(competitor’s time)/ (AWT for the class).
    for (let r of results) {
        if (r.CompetitiveStatus === CompetitiveStatus.NC) {continue;}
        if (r.CompetitiveStatus === CompetitiveStatus.COMP && r.CodeCheckingStatus === CodeCheckingStatus.FIN) {
            r.Points = 60 * r.Time! / classAWT;
        } else {
            r.Points = invalidResultScore;
        }
    }

    // Assign places to competitors
    results.sort(OusaAvgWinTimeComparer);
    results.forEach((result, index, arr) => {
        if (index === 0) {
            if (result.Points) {
                result.Place = index + 1;
            }
        } else if (result.Points) {
            // worried about floating point comparison not correctly
            // awarding ties. Award ties based on same TIME.
            // THIS NEEDS SOME REVIEW
            if (result.Time === arr[index-1].Time) {
                result.Place = arr[index-1].Place;
            } else {
                result.Place = index + 1;
            }
        }
    });
    return results
}

function OusaAvgWinTimeComparer(a:OusaAvgWinTimeResult, b:OusaAvgWinTimeResult): number {
    if (a.Place && b.Place) {
        return a.Place - b.Place;
    }

    if (a.Points && b.Points) {
        return a.Points - b.Points
    }

    if (a.CodeCheckingStatus !== b.CodeCheckingStatus) {
        return a.CodeCheckingStatus - b.CodeCheckingStatus;
    }

    if (a.CompetitiveStatus !== b.CompetitiveStatus) {
        return a.CompetitiveStatus - b.CompetitiveStatus;
    }

    if (a.Time && b.Time) {
        return a.Time - b.Time;
    } 
    
    if (a.Time) {return -1;}
    else if (b.Time) {return 1;}
    else {return 0;}
}

function CalcAwtForClass(raceResults:OusaAvgWinTimeResult[]):number|undefined {
    const valids = raceResults.filter(x => x.CompetitiveStatus === CompetitiveStatus.COMP && x.CodeCheckingStatus === CodeCheckingStatus.FIN && x.Time)

    if (!valids || !valids.length) {
        return undefined;
    }

    valids.sort((a,b) => a.Time! - b.Time!)

    let topFinishers:OusaAvgWinTimeResult[] = []
    const maxToConsider:number = valids.length > 3 ? 3 : valids.length
    topFinishers = valids.slice(0,maxToConsider);

    for (const f of topFinishers) {
        console.log(f.Name, f.Time)
    }

    const theAvgWinTime = topFinishers.reduce((sum,val)=>sum+val.Time!, 0) / topFinishers.length;

    console.log(theAvgWinTime);
    return theAvgWinTime;
}

