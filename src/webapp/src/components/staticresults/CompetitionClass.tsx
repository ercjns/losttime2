import { Guid } from "guid-typescript";
import { PersonResult } from "../../orienteering/IofResultXml";
import { LtStaticRaceClassResult } from "./RaceResult";
import { CocWorldCupScoreByPlace } from "./ScoreMethods";
import { PassThrough } from "stream";


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

export class CompetitionClass {
    // TemplateClassCodes?: String[];
    // TemplateComplementClassCodes?: String[];
    ID: Guid;
    RaceResults!: LtStaticRaceClassResult[];
    ComplementRaceResults!: LtStaticRaceClassResult[];
    Name!: string;
    IsMultiRace!: Boolean; //compute based on RaceResults?
    IsTeamClass!: Boolean;
    ScoreMethod!: IndividualScoreMethod;
    ScoreMethod_Multi?: MultiEventScoreMethodDefinition;
    ScoreMethod_Team?: TeamScoreMethodDefinition;
    ScoredCompetitionClass?: {
        TimeStamp: Date;
        Type: string; //enum?
        Results: WorldCupResult[];
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
        return false;
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
                if(this.ScoredCompetitionClass) {this.ScoredCompetitionClass.Type="Time"}
                this.ScoredCompetitionClass?.Results.forEach(x => x.Points = undefined);
            }
        }
        if (!this.IsMultiRace && this.IsTeamClass) {
            // do individual scoring things first
            if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                if (this.ScoreMethod_Team?.Collation===TeamCollationMethod.ScoreThenCombine) {
                    this.WorldCupScoring_Indv(true)
                } else {
                    this.WorldCupScoring_Indv()
                }
            }
            
            // now do team scoring things
            if (this.ScoreMethod_Team?.ScoreMethod===TeamScoreMethod.SumAllHighestWins) {
                // create teams
                // assign team scores
                // return scoredCompetitionClass with differnt object types?
                alert("TeamScores");
            }
        }
        return;
    }



    private assignScores(res:WorldCupResult[]):WorldCupResult[] {
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

    private WorldCupScoring_Indv(keepRaceClassesSeparate=false) {
        // create an array that contains WorldCupResult objects
        // for each and every PersonResult in the loaded this.RaceResults
        let ans: WorldCupResult[] = [];
        
        if (keepRaceClassesSeparate) {
            for (const race of this.RaceResults) {
                let res: WorldCupResult[] = [];
                if (race.PersonResults.length === undefined) {continue;}
                res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
                ans.push(...this.assignScores(res));
            }
        } else {
            let res: WorldCupResult[] = [];
            for (const race of this.RaceResults) {
                if (race.PersonResults.length === undefined) {continue;}
                res.push(...race.PersonResults.map(x => new WorldCupResult(x)));
            }
            ans.push(...this.assignScores(res));
        }

        this.ScoredCompetitionClass = {
            TimeStamp: new Date(),
            Type: "COC_WorldCup",
            Results: ans
        }
    }
}

class WorldCupResult {
    Raw: PersonResult;
    Name: String;
    Club?: String;
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
    MinimumRaces: Number;
    ContributingRaces: Number;

    constructor(
        scoreMethod: MultiEventScoreMethod,
        minimumRaces: Number,
        contributingRaces: Number
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
    ScoreMethod: TeamScoreMethod;
    MinimumResults: Number;
    MaximumResults: Number;
    Collation: TeamCollationMethod;

    constructor(
        scoreMethod: TeamScoreMethod,
        minResults: Number,
        maxResults: Number,
        collation: TeamCollationMethod
    ) {
        this.ScoreMethod = scoreMethod;
        this.MinimumResults = minResults;
        this.MaximumResults = maxResults;
        this.Collation = collation;
    }
}

export enum TeamScoreMethod {
    SumAllHighestWins,
    SumAllLowestWins
}

export enum TeamCollationMethod {
    ScoreThenCombine,
    CombineThenScore
}