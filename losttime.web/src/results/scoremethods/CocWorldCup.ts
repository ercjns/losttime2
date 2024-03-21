import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";
import { MultiEventScoreMethod, MultiEventScoreMethodDefinition, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
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

export class WorldCupMultiResultIndv {
    // THIS WAS BUILT FOR 2-Day Combined TIME
    // IT NEEDS TO BE ADJUSTED FOR USE WITH WIOL POINTS
    // THIS DESPARATELY NEEDS TO BE REFACTORED TO INHERIT FROM 
    // A COMMON MULTI-RESULT-INDIVIDUAL CLASS
    Raw: WorldCupResult[];
    TotalRaces: number;
    RacesRecorded: number;
    Name: string;
    BibNumber: number;
    Club?: string;
    Points?: number;
    Place?: number;
    isValid: boolean;

    constructor(totalRaces:number, resultindex:number, result:WorldCupResult) {
        this.isValid = false;
        this.RacesRecorded = 0;
        this.TotalRaces = totalRaces;
        this.Raw = new Array(totalRaces)
        this.addResultAtIndex(result, resultindex)
        this.BibNumber = result.Raw.Result.BibNumber;
        this.Name = result.Name;
        this.Club = result.Club;
    }

    addResultAtIndex(result:WorldCupResult, eventIdx:number) {
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
            throw "Min Races should equal Contributing Races"
        }
        if (this.TotalRaces < method.MinimumRaces) {
            throw "not enough races to provide a score"
        }
        if (this.RacesRecorded === method.MinimumRaces && 
                this.RacesRecorded === method.ContributingRaces) {
            // Force All races to be contributing races. needs updates to support
            // any other methods.
            this.isValid = true;
            this.Raw.forEach(function (x) {
                if (x.CodeCheckingStatus !== CodeCheckingStatus.FIN) {return undefined}
                if (x.CompetitiveStatus !== CompetitiveStatus.COMP) {return undefined}
            })
            if (method.ScoreMethod === MultiEventScoreMethod.SumAll) {
                const score = this.Raw.reduce((sum:number,current) => sum + (current.Points!), 0);
                this.Points = score;
                return score;
            }
            else {
                throw "Score method not implemented"
            }
        }
        return undefined;
    }
}

export class WorldCupTeamResult {
    TeamName: string;
    TeamShortName: string;
    Points: number;
    Place?: number;
    Contributors: WorldCupResult[];
    NonContributors: WorldCupResult[];

    constructor(teammates:WorldCupResult[], scoring:TeamScoreMethodDefinition) {
        if (teammates.length === 0) {
            throw Error("can't create a team result with no teammates");
        }
        this.TeamName = teammates[0].Club ?? "";
        this.TeamShortName = teammates[0].Club ?? "";
        if (scoring.ScoreMethod === TeamScoreMethod.SumAllHighestWins) {
            teammates.sort(WorldCupResultComparer);
            const maxContribThisTeam = teammates.findIndex((x) => x.Points === undefined);
            const contributorsSlice = maxContribThisTeam === -1 ? 
                scoring.MaximumResults : Math.min(scoring.MaximumResults, maxContribThisTeam);
            this.Contributors = teammates.slice(0,contributorsSlice);
            this.NonContributors = teammates.slice(contributorsSlice);
            this.Points = this.Contributors.reduce(
                (total, contributor) => total + (contributor.Points ?? 0),
                0
            )
        } else {
            throw Error("score method doesn't make sense for World Cup")
        }
    }
}

export type WorldCupResultsForClub = {
    "club": string|undefined,
    "raw": WorldCupResult[]
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

export function WorldCupMultiIndv_AssignPlaces(MultiEventResults:WorldCupMultiResultIndv[]): WorldCupMultiResultIndv[] {
    // assumes that everyone with points assigned is valid
    // and can recieve a place.
    // WorldCupMultiResultIndv.assignPoints() should not assign points if a place
    // should not be assigned.
    MultiEventResults.sort(WorldCupMultiIndvComparer)
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

function WorldCupMultiIndvComparer(a:WorldCupMultiResultIndv, b:WorldCupMultiResultIndv): number {
    if (a.Points && b.Points) {
        return a.Points - b.Points
    }
    if (a.Points) {return -1;}
    else if (b.Points) {return 1;}
    else return 0;
}

export function WorldCupScoring_groupByClub(results:WorldCupResult[]):WorldCupResultsForClub[] {
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