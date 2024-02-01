import { Guid } from "guid-typescript";
import { LtStaticRaceClassResult } from "./RaceResult";
import { WorldCupResult, WorldCupResultComparer, WorldCupScoring_Indv, WorldCupTeamScoring_assignPlaces, groupByClub } from "./scoremethods/CocWorldCup";
import { OusaAvgWinTimeResult, OusaAvgWinTimeScoring_Indv } from "./scoremethods/OusaAwt";

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
    ID: Guid;
    RaceResults!: LtStaticRaceClassResult[];
    PairedRaceResults!: LtStaticRaceClassResult[];
    Name!: string;
    IsMultiRace!: boolean; //compute based on RaceResults?
    IsTeamClass!: boolean;
    ScoreMethod!: IndividualScoreMethod;
    ScoreMethod_Multi?: MultiEventScoreMethodDefinition;
    ScoreMethod_Team?: TeamScoreMethodDefinition;
    ResultsCreatedTime?: Date;
    ResultsCreatedType?: ScoredCompetitionClassType;
    Results_Time?: WorldCupResult[] //don't love this.
    Results_WorldCup?: WorldCupResult[];
    Results_Temp_WorldCupTeams?: WorldCupResult[];
    Results_WorldCupTeams?: WorldCupTeamResult[];
    Results_OusaAvgWinTime?: OusaAvgWinTimeResult[];

    constructor() {
        this.ID = Guid.create();
    }

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

        // Single Race, Individuals
        if (!this.IsMultiRace && !this.IsTeamClass) {
            if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                // this.WorldCupScoring_Indv()
                this.Results_WorldCup = WorldCupScoring_Indv(this.RaceResults);
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.CocWorldCup;

            }
            else if (this.ScoreMethod===IndividualScoreMethod.Time) {
                // TODO:
                // need to adjust this so that we actually get a Time result type object
                this.Results_WorldCup = WorldCupScoring_Indv(this.RaceResults)
                this.Results_Time = this.Results_WorldCup;
                this.Results_Time.forEach(x => x.Points = undefined);
                this.Results_WorldCup = undefined;
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.Time;
            } 
            else if (this.ScoreMethod===IndividualScoreMethod.PointsOusaAverageWinningTime) {
                this.Results_OusaAvgWinTime = OusaAvgWinTimeScoring_Indv(this.RaceResults, this.PairedRaceResults)
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.OusaAvgWinTime
            }
            else {
                throw Error("Score method not implemented")
            }
        }
        
        // Single Race, Teams
        if (!this.IsMultiRace && this.IsTeamClass) {
            // do individual scoring things first
            if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                if (this.ScoreMethod_Team?.Collation===TeamCollationMethod.ScoreThenCombine) {
                    this.Results_Temp_WorldCupTeams = WorldCupScoring_Indv(this.RaceResults, true, true)
                } else {
                    this.Results_Temp_WorldCupTeams = WorldCupScoring_Indv(this.RaceResults, true, false)
                }
            } else {
                throw Error("Not sure how to do teams with individuals other than World Cup scoring")
            }
            
            // now do team scoring things
            if (this.ScoreMethod_Team === undefined) {
                throw new Error("No Team Score Method for Team Competition Class")
            }

            if (this.Results_Temp_WorldCupTeams === undefined) {throw Error("No results - HANDLE THIS CASE IN THE FUTURE")}

            let teams = groupByClub(this.Results_Temp_WorldCupTeams);

            let res:WorldCupTeamResult[] = []
            teams.forEach((x) => {
                if (x.raw.length >= this.ScoreMethod_Team!.MinimumResults) {
                    res.push(new WorldCupTeamResult(x.raw, this.ScoreMethod_Team!))
                }
            });

            let placed:WorldCupTeamResult[] = []
            if (this.ScoreMethod_Team?.ScoreMethod===TeamScoreMethod.SumAllHighestWins) {
                placed = WorldCupTeamScoring_assignPlaces(res)
            } else {
                throw Error("Haven't yet implemented other team score methods")
            }

            this.Results_WorldCupTeams = placed;
            this.ResultsCreatedTime = new Date();
            this.ResultsCreatedType = ScoredCompetitionClassType.CocWorldCupTeams;
        }
        return;
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