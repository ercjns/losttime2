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
import { MultiEventScoreMethod, MultiEventScoreMethodDefinition, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { LtStaticRaceClassResult } from "../RaceResult";
import { JNTeams } from "../competitionpresets/JN2024_teamComposition";
import { RaceTeams, TeamDefinition, TeamLevel } from "../competitionpresets/teamdefinition";
import { scoredCompClassComparer } from "./CocWorldCup";
import { CodeCheckingStatus, CompetitiveStatus, iofStatusParser } from "./IofStatusParser";

export class OusaAvgWinTimeResult {
    Raw: PersonResult;
    Name: string;
    BibNumber: number;
    Club?: string;
    Time?: number;
    Points?: number;
    Place?: number;
    CodeCheckingStatus!: CodeCheckingStatus;
    CompetitiveStatus!: CompetitiveStatus;

    constructor(raceResult:PersonResult) {
        this.Raw = raceResult;
        this.Name = (raceResult.Person.Name.Given + " " + raceResult.Person.Name.Family).trim();
        this.BibNumber = raceResult.Result.BibNumber;
        this.Club = raceResult.Organisation.ShortName;
        this.Time = raceResult.Result.Time;
        const statuses = iofStatusParser(this.Raw.Result.Status)
        this.CodeCheckingStatus = statuses.CodeCheckingStatus;
        this.CompetitiveStatus = statuses.CompetitiveStatus;
    }
}

export class OusaAvgWinTimeMultiResultIndv {
    Raw: OusaAvgWinTimeResult[];
    TotalRaces: number;
    RacesRecorded: number;
    Name: string;
    BibNumber: number;
    Club?: string;
    Points?: number;
    Place?: number;
    isValid: boolean;

    constructor(totalRaces:number, resultindex:number, result:OusaAvgWinTimeResult) {
        this.isValid = false;
        this.RacesRecorded = 0;
        this.TotalRaces = totalRaces;
        this.Raw = new Array(totalRaces)
        this.addResultAtIndex(result, resultindex)
        this.BibNumber = result.Raw.Result.BibNumber;
        this.Name = result.Name;
        this.Club = result.Club;
    }

    addResultAtIndex(result:OusaAvgWinTimeResult, eventIdx:number) {
        // console.log('Have this Multi result with ' + this.RacesRecorded + ' races recorded')
        // console.log(this.Raw);
        // console.log('Adding a new result at index ' + eventIdx)
        if (this.Raw[eventIdx] != undefined) {
            throw "Something's already here"
        }
        if (eventIdx > (this.TotalRaces-1)) {
            throw "Not tracking this many races"
        }
        this.Raw[eventIdx] = result;
        this.RacesRecorded += 1;
        return;
    }

    assignPoints(method:MultiEventScoreMethodDefinition) {
        if (method.MinimumRaces !== method.ContributingRaces) {
            // throw "Min Races should equal Contributing Races"
            return
        }
        if (this.TotalRaces < method.MinimumRaces) {
            // throw "not enough races to provide a score"
            return
        }
        if (this.RacesRecorded === method.MinimumRaces && 
                this.RacesRecorded === method.ContributingRaces) {
            // Force All races to be contributing races. needs updates to support
            // any other methods.
            this.isValid = true;
            if (method.ScoreMethod === MultiEventScoreMethod.SumAll) {
                const score = this.Raw.reduce((sum:number,current) => sum + (current.Points!), 0);
                this.Points = score;
                return score;
            }
            else {
                throw "Score method not implemented"
            }
        }
        return;
    }
}

export class OusaAvgWinTimeTeamResult {
    TeamName: string;
    TeamShortName: string;
    TeamInfo?: TeamDefinition;
    isValid: boolean;
    Points?: number;
    Place?: number;
    Contributors: OusaAvgWinTimeResult[];
    NonContributors: OusaAvgWinTimeResult[];

    constructor(
        teammates:OusaAvgWinTimeResult[],scoring:TeamScoreMethodDefinition,
        teaminfo?:TeamDefinition) {
        if (teammates.length === 0) {
            throw Error("can't create a team result with no teammates");
        }
        if (teaminfo !== undefined) {
            this.TeamName = teaminfo.Name;
            this.TeamShortName = "";
            this.TeamInfo = teaminfo
        } else {
            this.TeamName = teammates[0].Club ?? "";
            this.TeamShortName = teammates[0].Club ?? "";
        }
        
        if (scoring.ScoreMethod === TeamScoreMethod.SumMinLowestWins) {
            teammates.sort(OusaAvgWinTimeComparer);

            if (teammates.length >= scoring.MinimumResults) {
                this.Contributors = teammates.slice(0,scoring.MinimumResults)
                this.NonContributors = teammates.slice(scoring.MinimumResults)
                this.isValid = true;
            } else {
                this.Contributors = [];
                this.NonContributors = teammates;
                this.isValid = false;
            }
            
            if (this.isValid) {
                this.Points = this.Contributors.reduce(((sum:number, next) => sum + next.Points!),0)
            }

        } else {
            throw Error("score method doesn't make sense for Avg Win Time")
        }

    }
}

export type OusaAvgWinTimeResultsForClub = {
    "club": string|undefined,
    "raw": OusaAvgWinTimeResult[]
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

export function OusaAvgWinTimeScoring_GroupByClub(results:OusaAvgWinTimeResult[]):OusaAvgWinTimeResultsForClub[] {
    let teams:OusaAvgWinTimeResultsForClub[] = [];

    for (let i=0; i < results.length; i++) {
        let item = results[i];

        if (item.CompetitiveStatus === CompetitiveStatus.NC) {
            continue;
        }

        if (i===0) {
            teams = [{"club":item.Club, "raw":[item]}]
            continue;
        } 

        let teamIdx = teams.findIndex((t) => t.club === item.Club);
        if (teamIdx === -1) {
            teams.push({"club":item.Club, "raw":[item]})
        } else {
            let team = teams[teamIdx];
            team.raw.push(item);
        }
    }
    return teams;
}

export function OusaAvgWinTimeScoring_GroupByRaceTeam(results:OusaAvgWinTimeResult[]):{[key:string]:{teamInfo?:TeamDefinition,results:OusaAvgWinTimeResult[]}} {
    const resultsByTeam = results.reduce((groupbyteam, result) => {
        // TODO THIS HAS NO PROTECTION FOR TEAMS FROM THE WRONG LEVEL.
        // THAT SHOULD BE OK FOR NOW.
        // TODO THIS IS GETTING THE TEAM DEFINITIONS DIRECTLY
        // THOSE FOR SURE SHOULD BE PASSED IN SOMEHOW FROM THE COMP CLASS.
        // ALSO OK FOR NOW.
        const key = JNTeams.findTeamIdStringByBibNumber(result.BibNumber);
        const team = JNTeams.findTeamByBibNumber(result.BibNumber);
        // double == for checking null and undefined at once.
        if (groupbyteam[key] == undefined) {
            groupbyteam[key] = {results:[]}
            groupbyteam[key].teamInfo = team;
        }
        groupbyteam[key].results.push(result);
        return groupbyteam;
    }, {} as {[key:string]:{teamInfo?:TeamDefinition,results:OusaAvgWinTimeResult[]}});

    return resultsByTeam;
}


export function OusaAvgWinTimeTeamScoring_AssignPlaces(teams:OusaAvgWinTimeTeamResult[]) {
    teams.sort(OusaAvgWinTimeTeamComparer)
    teams.forEach((team, index, arr) => {
        if (index === 0) {
            if (team.Points) {
                team.Place = index + 1;
            }
        } else if (team.Points) {
            if (team.Points === arr[index-1].Points) {
                team.Place = arr[index-1].Place;
            } else {
                team.Place = index + 1;
            }
        }
    });
    return teams
}

export function OusaAvgWinTimeMultiIndv_AssignPlaces(MultiEventResults:OusaAvgWinTimeMultiResultIndv[]): OusaAvgWinTimeMultiResultIndv[] {
    // assumes that everyone with points assigned is valid
    // and can recieve a place.
    // assignPoints() should not assign points if a place
    // should not be assigned.
    MultiEventResults.sort(OusaAvgWinTimeMultiIndvComparer)
    MultiEventResults.forEach((indv, index, arr) => {
        if (index === 0) {
            if (indv.Points) {
                indv.Place = index + 1;
            }
        } else if (indv.Points) {
            if (indv.Points === arr[index-1].Points) {
                indv.Place = arr[index-1].Place;
            } else {
                indv.Place = index + 1;
            }
        }
    });
    return MultiEventResults;
        
} 

export function OusaAvgWinTimeSamePerson(a:OusaAvgWinTimeResult, b:OusaAvgWinTimeResult): boolean {
    if (a.Name === b.Name && a.Club === b.Club) {return true;}
    return false;
}

function OusaAvgWinTimeTeamComparer(a:OusaAvgWinTimeTeamResult, b:OusaAvgWinTimeTeamResult): number {
    if (a.Points && b.Points) {
        return a.Points - b.Points
    }
    if (a.Points) {return -1;}
    else if (b.Points) {return 1;}
    else return 0;
}

function OusaAvgWinTimeMultiIndvComparer(a:OusaAvgWinTimeMultiResultIndv, b:OusaAvgWinTimeMultiResultIndv): number {
    if (a.Points && b.Points) {
        return a.Points - b.Points
    }
    if (a.Points) {return -1;}
    else if (b.Points) {return 1;}
    else return 0;
}

function OusaAvgWinTimeComparer(a:OusaAvgWinTimeResult, b:OusaAvgWinTimeResult): number {
    // if (a.Place && b.Place) {
    //     return a.Place - b.Place;
    // }

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

    // for (const f of topFinishers) {
    //     console.log(f.Name, f.Time)
    // }

    const theAvgWinTime = topFinishers.reduce((sum,val)=>sum+val.Time!, 0) / topFinishers.length;

    // console.log(theAvgWinTime);
    return theAvgWinTime;
}

