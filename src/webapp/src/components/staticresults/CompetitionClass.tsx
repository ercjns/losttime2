import { Guid } from "guid-typescript";
import { PersonResult } from "../../orienteering/IofResultXml";
import { LtStaticRaceClassResult } from "./RaceResult";
import { CocWorldCupScoreByPlace } from "./ScoreMethods";

export enum CodeCheckingStatus {
    FIN,
    MSP,
    DNF,
    UNK
}

export enum CompetitiveStatus {
    COMP,
    SWD,
    OVT,
    NC,
    DSQ
}

export enum IndividualScoreMethod {
    AlphaWithoutTimes = -2,
    AlphaWithTimes = -1,
    Time = 0,
    Points1kScottish,
    PointsCocWorldCup,
    PointsOusaAverageWinningTime
}

export enum TeamScoreMethod {
    SumAllHighestWins,
    SumAllLowestWins
}

export enum TeamCollationMethod {
    ScoreThenCombine,
    CombineThenScore
}

export enum CompetitionClassType {
    OneRaceIndv,
    OneRaceTeam,
    ManyRaceIndv,
    ManyRaceTeam
}

export enum ScoredCompetitionClassType {
    Time,
    Scottish,
    CocWorldCup,
    CocWorldCupTeams,
    OusaAvgWinTime,
    OusaAvgWinTimeTeams
}

export class CompetitionClass {
    // TemplateClassCodes?: String[];
    // TemplateComplementClassCodes?: String[];
    ID: Guid;
    RaceResults!: LtStaticRaceClassResult[];
    ComplementRaceResults!: LtStaticRaceClassResult[];
    Name!: string;
    IsMultiRace!: boolean; //compute based on RaceResults?
    IsTeamClass!: boolean;
    ScoreMethod!: IndividualScoreMethod;
    ScoreMethod_Multi?: MultiEventScoreMethodDefinition;
    ScoreMethod_Team?: TeamScoreMethodDefinition;
    TempResults?: WorldCupResult[];
    ScoredCompetitionClass?: {
        TimeStamp: Date;
        Type: ScoredCompetitionClassType;
        Results: WorldCupResult[] | WorldCupTeamResult[];
        // Results: Array<WorldCupResult | WorldCupTeamResult>;
    };

    constructor() {
        this.ID = Guid.create();
    }

    findRaceResults() {
        // loop through the template class codes
        // add any race results that are supposed to be here.
        // from... the loaded race results, which maybe are passed in?
        return;
    };

    readyToScore() : Boolean {
        // are there race results
        // TODO
        // are there scoring methods that make sense given other parameters
        // TODO
        return true;
    }

    computeScores() {
        if (!this.readyToScore()) {
            throw new Error("Not Ready to Score");
        }
        if (!this.IsMultiRace && !this.IsTeamClass) {
            if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                this.WorldCupScoring_Indv()
            }
            if (this.ScoreMethod===IndividualScoreMethod.Time) {
                // This is a hack but I think it's ok?
                this.WorldCupScoring_Indv()
                if(this.ScoredCompetitionClass) {this.ScoredCompetitionClass.Type = ScoredCompetitionClassType.Time}
                this.ScoredCompetitionClass?.Results.forEach(x => x.Points = undefined);
            }
        }
        if (!this.IsMultiRace && this.IsTeamClass) {
            // do individual scoring things first
            if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                if (this.ScoreMethod_Team?.Collation===TeamCollationMethod.ScoreThenCombine) {
                    this.WorldCupScoring_Indv(true, true)
                } else {
                    this.WorldCupScoring_Indv(true, false)
                }
            }
            
            // now do team scoring things
            if (this.ScoreMethod_Team === undefined) {
                throw new Error("No Team Score Method for Team Competition Class")
            }

            // teams: array of objects, one per team, with all raw WorldCupResults
            //   results are put on a team baesd on having the same WorldCupResult.Club
            if (this.TempResults === undefined) {throw Error("No results - HANDLE THIS CASE IN THE FUTURE")}
            
            let teams:[{"club":string|undefined, "raw":WorldCupResult[]}] | undefined;
            for (let i=0; i < this.TempResults.length; i++) {
                let item = this.TempResults[i];
                if (item instanceof WorldCupResult) {
                    if (i===0) {
                        teams = [{"club":item.Club, "raw":[item]}]
                        continue;
                    } 

                    if (teams === undefined) {throw Error("handling")}
                    let teamIdx = teams.findIndex((t) => t.club === item.Club);
                    if (teamIdx === -1) {
                        teams.push({"club":item.Club, "raw":[item]})
                    } else {
                        let team = teams[teamIdx];
                        team.raw.push(item);
                    }
                } else {
                    throw Error("not the right type")
                }
            }

            // Create entries in the ScoredCompetitionClass property. Note these are not yet 
            // ready to be used, they'll not be ranked.
            let res:WorldCupTeamResult[] = []
            teams!.forEach((x) => {
                if (x.raw.length >= this.ScoreMethod_Team!.MinimumResults) {
                    res.push(new WorldCupTeamResult(x.raw, this.ScoreMethod_Team!))
                }
            });
            let placed:WorldCupTeamResult[]|WorldCupResult[] = []
            if (this.ScoreMethod_Team?.ScoreMethod===TeamScoreMethod.SumAllHighestWins) {
                // assign team scores based on the teams in scoredcompetitionclass.results.
                // TODO: assign team POSITIONS - 
                //     update (set) the values in this.ScoredCompetitionClass.Results.Position
                // this.ScoredCompetitionClass.Results.sort(this.scoredCompClassComparer);
                placed = this.WorldCupTeamScoring_assignPlaces(res)
            }

            this.ScoredCompetitionClass = {
                "TimeStamp": new Date(),
                "Type": ScoredCompetitionClassType.CocWorldCupTeams,
                "Results": placed ? placed: res,
            }


        }
        return;
    }

    private scoredCompClassComparer(a:any, b:any) {
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

    private WorldCupTeamScoring_assignPlaces(res:WorldCupTeamResult[]|WorldCupResult[]):WorldCupTeamResult[]|WorldCupResult[] {
        res.sort(this.scoredCompClassComparer)
        res.forEach((result, index, arr) => {
            if (!(result instanceof WorldCupTeamResult)) {throw new Error("HOW NOW")}
            else {
                if (index === 0) {
                    result.Place = 1
                }
                else if (this.scoredCompClassComparer(result, arr[index-1]) === 0) {
                    result.Place = arr[index-1].Place
                } else {
                    result.Place = index + 1
                }
            }
        })
        return res;
    }

    private WorldCupScoring_assignPoints(res:WorldCupResult[]):WorldCupResult[] {
        // For all COMP/FIN, sort by time, assign places, assign points.
        // For COMP/(MSP,DNF,UNK) - no place, assign 0 points.
        // For (OVT,SWD)/(ANY) - no place, assign 0 points.
        // All others get no place and no points.
        res.sort((a,b) => WorldCupResultComparer(a,b));
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

    private WorldCupScoring_Indv(tempForTeamScoring=false, keepRaceClassesSeparate=false) {
        // create an array that contains WorldCupResult objects
        // for each and every PersonResult in the loaded this.RaceResults
        let ans: WorldCupResult[] = [];
        
        if (keepRaceClassesSeparate) {
            for (const race of this.RaceResults) {
                let res: WorldCupResult[] = [];
                if (race.PersonResults.length === undefined) {continue;}
                res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
                ans.push(...this.WorldCupScoring_assignPoints(res));
            }
        } else {
            let res: WorldCupResult[] = [];
            for (const race of this.RaceResults) {
                if (race.PersonResults.length === undefined) {continue;}
                res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
            }
            ans.push(...this.WorldCupScoring_assignPoints(res));
        }

        if (tempForTeamScoring) {
            this.TempResults = ans.filter((x) => x.CompetitiveStatus !== CompetitiveStatus.NC)
        } else {
            this.ScoredCompetitionClass = {
                TimeStamp: new Date(),
                Type: ScoredCompetitionClassType.CocWorldCup,
                Results: ans
            }
        }
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
        this.setCompStatus();
    }

    private setCompStatus () {
        switch (this.Raw.Result.Status) {
            case "OK":
                this.CompetitiveStatus = CompetitiveStatus.COMP;
                this.CodeCheckingStatus = CodeCheckingStatus.FIN;
                break;
            case "DidNotFinish":
                this.CompetitiveStatus = CompetitiveStatus.COMP;
                this.CodeCheckingStatus = CodeCheckingStatus.DNF;
                break;
            case "MissingPunch":
                this.CompetitiveStatus = CompetitiveStatus.COMP;
                this.CodeCheckingStatus = CodeCheckingStatus.MSP;
                break;
            case "NotCompeting":
                this.CompetitiveStatus = CompetitiveStatus.NC;
                this.CodeCheckingStatus = CodeCheckingStatus.UNK;
                break;
            default:
                this.CompetitiveStatus = CompetitiveStatus.NC; 
                this.CodeCheckingStatus = CodeCheckingStatus.UNK;
                break;
        }
    }
}

function WorldCupTeamComparer(a:WorldCupTeamResult, b:WorldCupTeamResult): number {
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


function WorldCupResultComparer(a:WorldCupResult, b:WorldCupResult): number {
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



class MultiEventScoreMethodDefinition {
    ScoreMethod: MultiEventScoreMethod;
    MinimumRaces: number;
    ContributingRaces: number;

    constructor(
        scoreMethod: MultiEventScoreMethod,
        minimumRaces: number,
        contributingRaces: number
    ) {
        this.ScoreMethod = scoreMethod;
        this.MinimumRaces = minimumRaces;
        this.ContributingRaces = contributingRaces;
    }
}

enum MultiEventScoreMethod {
    SumAll,
    SumNTiebreakAll,
    SumNTiebreakN
}

export class TeamScoreMethodDefinition {
    MinimumResults: number;
    MaximumResults: number;
    ScoreMethod: TeamScoreMethod;
    Collation: TeamCollationMethod;

    constructor(
        minResults: number,
        maxResults: number,
        scoreMethod: TeamScoreMethod,
        collation: TeamCollationMethod
    ) {
        this.MinimumResults = minResults;
        this.MaximumResults = maxResults;
        this.ScoreMethod = scoreMethod;
        this.Collation = collation;
    }
}