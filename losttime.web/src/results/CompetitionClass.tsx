import { Guid } from "guid-typescript";
import { LtEvent, LtStaticRaceClassResult } from "./RaceResult";
import { WorldCupResult, WorldCupResultComparer, WorldCupScoring_Indv, WorldCupTeamScoring_assignPlaces, WorldCupScoring_groupByClub, WorldCupTeamResult, WorldCupMultiResultIndv, WorldCupMultiIndv_AssignPlaces } from "./scoremethods/CocWorldCup";
import { OusaAvgWinTimeMultiIndv_AssignPlaces, OusaAvgWinTimeMultiResultIndv, OusaAvgWinTimeResult, OusaAvgWinTimeScoring_GroupByClub, OusaAvgWinTimeScoring_GroupByRaceTeam, OusaAvgWinTimeScoring_Indv, OusaAvgWinTimeTeamResult, OusaAvgWinTimeTeamScoring_AssignPlaces } from "./scoremethods/OusaAwt";
import { TeamLevel } from "./competitionpresets/teamdefinition";
import { JNTeams } from "./competitionpresets/JN2024_teamComposition";
import { CodeCheckingStatus, CompetitiveStatus } from "./scoremethods/IofStatusParser";

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
    SumAllLowestWins,
    SumMinLowestWins
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
    OusaAvgWinTimeTeams,
    Multi_Time,
    Multi_OusaAvgWinTime,
    Multi_OusaAvgWinTimeTeams,
}

export class CompetitionClass {
    ID: Guid;
    RaceResults!: LtStaticRaceClassResult[];
    PairedRaceResults!: LtStaticRaceClassResult[];
    Name!: string;
    IsMultiRace!: boolean; //compute based on RaceResults?
    IsTeamClass!: boolean;
    TeamLevel?: TeamLevel;
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
    Results_Temp_OusaAvgWinTimeTeams?: OusaAvgWinTimeResult[];
    Results_OusaAvgWinTimeTeams?: OusaAvgWinTimeTeamResult[];
    Results_Multi_OusaAvgWinTime?: OusaAvgWinTimeMultiResultIndv[];
    Results_Multi_Time?: WorldCupMultiResultIndv[];

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
                console.log('RaceResults Classes '+ this.RaceResults.length)
                this.Results_OusaAvgWinTime = OusaAvgWinTimeScoring_Indv(this.RaceResults, this.PairedRaceResults)
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.OusaAvgWinTime
            }
            else {
                throw Error("Score method not implemented")
            }
        }
        
        // Single Race, Teams
        else if (!this.IsMultiRace && this.IsTeamClass) {
            if (this.ScoreMethod_Team === undefined) {
                throw new Error("No Team Score Method for Team Competition Class")
            } 

            // COC WORLD CUP TEAMS
            else if (this.ScoreMethod===IndividualScoreMethod.PointsCocWorldCup) {
                // COC World Cup Teams
                if (this.ScoreMethod_Team.Collation===TeamCollationMethod.ScoreThenCombine) {
                    this.Results_Temp_WorldCupTeams = WorldCupScoring_Indv(this.RaceResults, true, true)
                } else {
                    this.Results_Temp_WorldCupTeams = WorldCupScoring_Indv(this.RaceResults, true, false)
                }

                if (this.Results_Temp_WorldCupTeams === undefined) {throw Error("No results - HANDLE THIS CASE IN THE FUTURE")}
                
                let teams = WorldCupScoring_groupByClub(this.Results_Temp_WorldCupTeams);

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
                return;
            } 

            // OUSA AWT TEAMS
            else if (this.ScoreMethod === IndividualScoreMethod.PointsOusaAverageWinningTime) {
                // AWT Teams for OUSA IS/IC Competition
                // this.RaceResults has results from both M and F classes
                // Teams are co-ed but classes are individual.
                // Need to split out classes to score individually.

                // does not use this.PairedRaceResults
                // instead, expects there to be exactly two classes defined, and
                // assumes that they are paired with one another (which is true)

                const classes = this.RaceResults.flatMap(x => x.Class);

                if (classes.length !== 2) {
                    if (classes.length === 0) {
                        // no results
                        this.Results_OusaAvgWinTimeTeams = undefined;
                        this.Results_OusaAvgWinTime = undefined;
                        this.ResultsCreatedTime = new Date();
                        this.ResultsCreatedType = ScoredCompetitionClassType.OusaAvgWinTimeTeams;
                        return;
                    } else if (classes.length === 1) {
                        // only results in M OR F, not yet both.
                        this.Results_OusaAvgWinTime = OusaAvgWinTimeScoring_Indv(this.RaceResults)
                    } else {
                        // three or more? something's messed up.
                        console.log(classes);
                        throw Error("Gotta be exactly 2 classes for AWT Team scoring.")
                    }
                } else {
                    // there are M and F classes, unknown order, so just a and b:
                    const a = this.RaceResults.filter(x => x.Class === classes[0]);
                    const b = this.RaceResults.filter(x => x.Class === classes[1]);
    
                    // score a with b as the paired class
                    this.Results_OusaAvgWinTime = OusaAvgWinTimeScoring_Indv(a, b);
                    // score b with a as the paired class, add those results to the mix
                    this.Results_OusaAvgWinTime.push(...OusaAvgWinTimeScoring_Indv(b, a));
                }
                
                // OLD WAY: GROUP BY CLUB -> OusaAvgWinTimeTeamResult[]
                // let clubTeams = OusaAvgWinTimeScoring_GroupByClub(this.Results_OusaAvgWinTime);

                // let res:OusaAvgWinTimeTeamResult[] = []
                // clubTeams.forEach((x) => {
                //     res.push(new OusaAvgWinTimeTeamResult(x.raw, this.ScoreMethod_Team!))
                // });


                // NEW WAY: GROUP BY PRE-DEFINED RACE TEAM -> OusaAvgWinTime*Team*Result[]
                // TODO: This doesn't currently protect for finding a team from 
                // the wrong level. That's ok for now, it's a team assignment issue, 
                // not a code issue.
                let raceTeams = OusaAvgWinTimeScoring_GroupByRaceTeam(this.Results_OusaAvgWinTime);
                let res:OusaAvgWinTimeTeamResult[] = []
                for (const key in raceTeams) {
                    if (key === 'undefined') {continue;}
                    res.push(new OusaAvgWinTimeTeamResult(raceTeams[key].results, this.ScoreMethod_Team!, raceTeams[key].teamInfo));
                };

    
                let placed = OusaAvgWinTimeTeamScoring_AssignPlaces(res);
                
                this.Results_OusaAvgWinTimeTeams = placed;
                this.Results_OusaAvgWinTime = undefined;
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.OusaAvgWinTimeTeams;
                return;

            }
            else {
                throw Error("Not sure how to do teams with individuals other than World Cup scoring")
            }
        }

        // Multi Race, Individuals
        else if (this.IsMultiRace && !this.IsTeamClass) {

            // OUSA IS/IC - Sum points from each day, lowest wins.
            if (this.ScoreMethod===IndividualScoreMethod.PointsOusaAverageWinningTime) {

                var events:LtEvent[] = [];
                for (const r of this.RaceResults) {
                    if (!events.includes(r.Event)) {
                        events.push(r.Event)
                    }
                }
                events.sort((a,b) => a.Order - b.Order)

                // console.log('Events')
                // console.log(events)

                // group the RaceResults by Event
                const RaceResultsByEvent:LtStaticRaceClassResult[][] = Array(events.length).fill([])
                for (const [idx, e] of events.entries()) {
                    for (const r of this.RaceResults) {
                        if (r.Event.ID === e.ID) {
                            // RaceResultsByEvent[idx].push(r); original. Nope
                            // RaceResultsByEvent.push([r]); nope

                            // this works but will break if multiple classes.
                            // RaceResultsByEvent.splice(idx,1,[r]);

                            // TODO does this work with multiple classes?
                            // DO I care? It works like the one-liner above if not.
                            const existing = RaceResultsByEvent.splice(idx,1);
                            const updated = existing.flat().concat(r);
                            RaceResultsByEvent[idx] = updated;
                        } else {
                            continue;
                        }
                    }
                }

                // console.log('RaceResultsByEvent')
                // console.log(RaceResultsByEvent);


                const PairedRaceResultsByEvent:LtStaticRaceClassResult[][] = Array(events.length).fill([])
                // Must support no Paired results. I think this does.
                // TODO test above stated case
                for (const [idx, e] of events.entries()) {
                    for (const r of this.PairedRaceResults) {
                        if (r.Event.ID === e.ID) {
                            // see above!
                            const existing = PairedRaceResultsByEvent.splice(idx,1);
                            const updated = existing.flat().concat(r);
                            PairedRaceResultsByEvent[idx] = updated;
                        }
                    }
                }

                // score each individual event
                const ScoredResultsByEvent:OusaAvgWinTimeResult[][] = []
                for (var idx = 0; idx < RaceResultsByEvent.length; idx++) {
                    const scored = OusaAvgWinTimeScoring_Indv(
                        RaceResultsByEvent[idx],
                        PairedRaceResultsByEvent[idx]
                    )
                    ScoredResultsByEvent.push(scored)
                }

                // console.log('ScoredResultsByEvent')
                // console.log(ScoredResultsByEvent);


                // match people up across events
                // create multi-day event objects

                // there's VERY LIKELY a better way to do this
                // like.... reduce?
                
                // ALSO - allow matching based on BIB NUMBER.
                // THAT'LL work for my shortest term need.


                const MultiEventResults:OusaAvgWinTimeMultiResultIndv[] = [];
                for (const [idx, singleEventResults] of ScoredResultsByEvent.entries()) {
                    if (idx === 0) {
                        // first event, always add a new record.
                        for (const result of singleEventResults) {
                            MultiEventResults.push(new OusaAvgWinTimeMultiResultIndv(events.length, idx, result));
                        }
                    } else {
                        // not the first event
                        for (const result of singleEventResults) {
                            // look for a matching multiresult that already exists
                            // TODO: switch this to BIB matching rather than name+club
                            const match = MultiEventResults.findIndex( x => x.Name == result.Name && x.Club == result.Club);

                            // if it exists, add the event result at correct index
                            if (match >= 0) {
                                MultiEventResults[match].addResultAtIndex(result,idx);
                            } else {
                            // if it doesn't exist, create new and push.
                                MultiEventResults.push(new OusaAvgWinTimeMultiResultIndv(events.length, idx, result));
                            }
                        }
                    }
                }

                // validate and score the multi-event objects
                if (this.ScoreMethod_Multi instanceof MultiEventScoreMethodDefinition) {
                    MultiEventResults.forEach(el => {
                        el.assignPoints(this.ScoreMethod_Multi!)
                    });
                }
                // Assign places to those with points
                OusaAvgWinTimeMultiIndv_AssignPlaces(MultiEventResults);

                this.Results_Multi_OusaAvgWinTime = MultiEventResults
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.Multi_OusaAvgWinTime;
            }
            else if (this.ScoreMethod===IndividualScoreMethod.Time) {
                // TWO DAY COMBINED TIME

                // -- BEGIN COPY FROM ABOVE --
                var events:LtEvent[] = [];
                for (const r of this.RaceResults) {
                    if (!events.includes(r.Event)) {
                        events.push(r.Event)
                    }
                }
                events.sort((a,b) => a.Order - b.Order)

                // console.log('Events')
                // console.log(events)

                // group the RaceResults by Event
                const RaceResultsByEvent:LtStaticRaceClassResult[][] = Array(events.length).fill([])
                for (const [idx, e] of events.entries()) {
                    for (const r of this.RaceResults) {
                        if (r.Event.ID === e.ID) {
                            // RaceResultsByEvent[idx].push(r); original. Nope
                            // RaceResultsByEvent.push([r]); nope

                            // this works but will break if multiple classes.
                            // RaceResultsByEvent.splice(idx,1,[r]);

                            // TODO does this work with multiple classes?
                            // DO I care? It works like the one-liner above if not.
                            const existing = RaceResultsByEvent.splice(idx,1);
                            const updated = existing.flat().concat(r);
                            RaceResultsByEvent[idx] = updated;
                        } else {
                            continue;
                        }
                    }
                }

                // console.log('RaceResultsByEvent')
                // console.log(RaceResultsByEvent);

                // -- END COPY FROM ABOVE --

                // "score" each individual event
                const ScoredResultsByEvent:WorldCupResult[][] = []
                for (var idx = 0; idx < RaceResultsByEvent.length; idx++) {
                    let scored = WorldCupScoring_Indv(RaceResultsByEvent[idx]);
                    // Set score as time in seconds.
                    // Multi-event scoing wants to operate on "Points", not times.
                    // Only assign times as points for people who did get points
                    // as those are the people with valid competitive results

                    for (const result of scored) {
                        if (result.Points == undefined) {continue;}
                        else if (result.Points === 0) {result.Points = undefined;}
                        else {
                            // Got points from WC scoring, should be good
                            // But going to explicitly check here
                            // So that's not hidden.
                            if (result.CodeCheckingStatus === CodeCheckingStatus.FIN && result.CompetitiveStatus === CompetitiveStatus.COMP) {
                                result.Points = result.Time;
                            }
                            else {
                                // shouldn't end up here, but 
                                result.Points = undefined;
                            }
                        }
                    }
                    ScoredResultsByEvent.push(scored)
                }

                // match people across events
                // create multi-day event objects

                // -- BEGIN MOSTLY COPY FROM ABOVE
                const MultiEventResults:WorldCupMultiResultIndv[] = [];
                for (const [idx, singleEventResults] of ScoredResultsByEvent.entries()) {
                    if (idx === 0) {
                        // first event, always add a new record.
                        for (const result of singleEventResults) {
                            MultiEventResults.push(new WorldCupMultiResultIndv(events.length, idx, result));
                        }
                    } else {
                        // not the first event
                        for (const result of singleEventResults) {
                            // look for a matching multiresult that already exists
                            // TODO: switch this to BIB matching rather than name+club
                            // World cup does not have bib piped through.
                            const match = MultiEventResults.findIndex( x => x.Name == result.Name && x.Club == result.Club);

                            // if it exists, add the event result at correct index
                            if (match >= 0) {
                                MultiEventResults[match].addResultAtIndex(result,idx);
                            } else {
                            // if it doesn't exist, create new and push.
                                MultiEventResults.push(new WorldCupMultiResultIndv(events.length, idx, result));
                            }
                        }
                    }
                }
                // -- END MOSTLY COPY FROM ABOVE

                // -- BEGIN COPY FROM ABOVE

                // validate and score the multi-event objects
                if (this.ScoreMethod_Multi instanceof MultiEventScoreMethodDefinition) {
                    MultiEventResults.forEach(el => {
                        el.assignPoints(this.ScoreMethod_Multi!)
                    });
                }
                // Assign places to those with points
                WorldCupMultiIndv_AssignPlaces(MultiEventResults);

                this.Results_Multi_Time = MultiEventResults;
                this.ResultsCreatedTime = new Date();
                this.ResultsCreatedType = ScoredCompetitionClassType.Multi_Time;

            }
            else {
                throw Error("Score method not implemented");
            }
        }

        // Multi-Race Teams
        else if (this.IsMultiRace && this.IsTeamClass) {
            throw Error("Need to implement multi-race teams")
        }
        return;
    }
}

export class MultiEventScoreMethodDefinition {
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

export enum MultiEventScoreMethod {
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