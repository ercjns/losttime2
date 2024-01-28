import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { WorldCupResultsForClub, WorldCupTeamResult } from "../CompetitionClass";
import { LtStaticRaceClassResult } from "../RaceResult";
import { CodeCheckingStatus, CompetitiveStatus, iofStatusParser } from "./IofStatusParser";

export class WorldCupResult {
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



function CocWorldCupScoreByPlace(place:number):number {
    if (place === 1) {return 100;}
    else if (place === 2) {return 95;}
    else if (place === 3) {return 92;}
    else {
        return place <= 94 ? 94-place : 0;
    }
}

export function WorldCupTeamComparer(a:WorldCupTeamResult, b:WorldCupTeamResult): number {
    if (a.Place && b.Place) {
        return a.Place - b.Place;
    }
    if (a.Points !== b.Points) {
        return b.Points - a.Points;
    }
    const minContributors = Math.min(a.Contributors.length, b.Contributors.length);
    for (let i=0; i<minContributors; i++) {
        if (a.Contributors[i].Points !== b.Contributors[i].Points) {
            return b.Contributors[i].Points! - a.Contributors[i].Points!;
        }
    }
    if (a.Contributors[minContributors+1]) {return -1;}
    else if (b.Contributors[minContributors+1]) {return 1;}
    else {return 0;}
}


export function WorldCupResultComparer(a:WorldCupResult, b:WorldCupResult): number {
    // ideally this works both before anything's been figured out, AND after.
    if (a.Place && b.Place) {
        return a.Place - b.Place;
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

export function scoredCompClassComparer(a:any, b:any) {
    if (a instanceof WorldCupResult && b instanceof WorldCupResult) {
        return WorldCupResultComparer(a,b)
    }
    else if (a instanceof WorldCupTeamResult && b instanceof WorldCupTeamResult) {
        return WorldCupTeamComparer(a,b)
    }
    else {
        throw new Error("can't compare these things they're not the same");
    }
}

export function WorldCupTeamScoring_assignPlaces(res:WorldCupTeamResult[]):WorldCupTeamResult[] {
    res.sort(scoredCompClassComparer)
    res.forEach((result, index, arr) => {
        if (index === 0) {
            result.Place = 1
        }
        else if (scoredCompClassComparer(result, arr[index-1]) === 0) {
            result.Place = arr[index-1].Place
        } else {
            result.Place = index + 1
        }
    })
    return res;
}

export function WorldCupScoring_assignPoints(res:WorldCupResult[]):WorldCupResult[] {
    // For all COMP/FIN, sort by time, assign places, assign points.
    // For COMP/(MSP,DNF,UNK) - no place, assign 0 points.
    // For (OVT,SWD)/(ANY) - no place, assign 0 points.
    // All others get no place and no points.
    res.sort(WorldCupResultComparer);
    res.forEach((result, index, arr) => {
        if (index === 0) {
            if (result.CompetitiveStatus !== CompetitiveStatus.COMP) {
                if (result.CompetitiveStatus < CompetitiveStatus.NC) {
                    result.Points = 0;
                }
            }
            else {
                result.Place = index + 1;
                result.Points = CocWorldCupScoreByPlace(result.Place);
            }
        } 
        else if (result.CompetitiveStatus === CompetitiveStatus.COMP) {
            if (result.CodeCheckingStatus === CodeCheckingStatus.FIN) {
                if (result.Time === arr[index-1].Time) {
                    result.Place = arr[index-1].Place;
                    result.Points = arr[index-1].Points;
                } else {
                    result.Place = index + 1;
                    result.Points = CocWorldCupScoreByPlace(result.Place);
                }
            }
            else {
                result.Points = 0;
            }
        } else if (result.CompetitiveStatus < CompetitiveStatus.NC) {
            result.Points = 0;
        }
    });
    return res;
}

export function WorldCupScoring_Indv(
    raceResults:LtStaticRaceClassResult[],
    tempForTeamScoring=false, 
    keepRaceClassesSeparate=false): WorldCupResult[] {
    // create an array that contains WorldCupResult objects
    // for each and every PersonResult in the loaded this.RaceResults
    let ans: WorldCupResult[] = [];
    
    if (keepRaceClassesSeparate) {
        for (const race of raceResults) {
            let res: WorldCupResult[] = [];
            if (race.PersonResults.length === undefined) {continue;}
            res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
            ans.push(...WorldCupScoring_assignPoints(res));
        }
    } else {
        let res: WorldCupResult[] = [];
        for (const race of raceResults) {
            if (race.PersonResults.length === undefined) {continue;}
            res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
        }
        ans.push(...WorldCupScoring_assignPoints(res));
    }
    if (tempForTeamScoring) {
        return ans.filter((x) => x.CompetitiveStatus !== CompetitiveStatus.NC);
    } else {
        return ans;
    }
}

export function groupByClub(results:WorldCupResult[]):WorldCupResultsForClub[] {
    let teams:WorldCupResultsForClub[] = [];

    for (let i=0; i < results.length; i++) {
        let item = results[i];
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