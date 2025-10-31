import { TeamInfo } from "../../../shared/orienteeringtypes/TeamInfo";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";
import { Computed_Cascade_ManyTeamPointed } from "../../ComputedCompetitionClass/Computed_Cascade_ManyTeamWorldCup";
import { Computed_Cascade_SingleTeamPointed } from "../../ComputedCompetitionClass/Computed_Cascade_SingleTeamPointed";
import { CompetitionClass } from "../CompetitionClass";
import { ManyRaceTeamResult } from "../ManyRaceTeamResult";
import { compareSingleTeamByPointsHighestFirst, isSingleRaceTeamResult, SingleRaceTeamResult } from "../SingleRaceTeamResult";
import { Cascade_SingleTeamWorldCup } from "./Cascade_SingleTeamWorldCup";


export class Cascade_ManyTeamWorldCup extends CompetitionClass {

    competitionClassType = CompetitionClassType.MultiEventTeam;
    scoreMethod = Results2ScoreMethod.ManyTeam_Cascade_WorldCup;

    scoreMethodFriendly(): string {
        return 'Series - Team - CascadeOC Winter';
    }

    compute(): Computed_Cascade_ManyTeamPointed {
        // Team-Score each individual race 
        // note for Co-Ed teams there are multiple race classes to score together, by race:
        let scoredRaceClasses:Computed_Cascade_SingleTeamPointed[] = [];
        const raceIds = [...new Set(this.contributingResults.map((x) => x.race_id))]
        raceIds.forEach((raceId) => {
            const classes = this.contributingResults.filter((x) => x.race_id.equals(raceId))
            const scored = new Cascade_SingleTeamWorldCup('Edit Me', classes)
                .compute();
            scoredRaceClasses.push(scored);
        })
        
        // build series results - find all teams:
        let teams:TeamInfo[] = []
        scoredRaceClasses.forEach((scoredTeamClass) => {
            scoredTeamClass.results.forEach((teamResult) => {
                if (!teams.some((x) => x.isSame(teamResult.teamInfo))) {
                    teams = [...teams, teamResult.teamInfo]
                }
            })
        })

        // build series results - make a multi-result for each team
        let seriesTeams:ManyRaceTeamResult[] = []
        teams.forEach((t) => {
            let singleResults = Array<SingleRaceTeamResult|undefined>(scoredRaceClasses.length).fill(undefined);
            for (let [idx, c] of scoredRaceClasses.entries()) {
                const res = c.results.find((r) => r.teamInfo.isSame(t));
                if (res) {singleResults[idx] = res;}
            }
            seriesTeams.push(new ManyRaceTeamResult(singleResults))
        })

        // // compute series score
        seriesTeams.forEach(this.assignSeriesPoints);

        // // order by points
        seriesTeams.sort(compareManyTeamHighestFirst);

        // for series, make sure there are actually points
        // copied from individuals, seems less necessary for teams
        // but isn't going to hurt anything other than performance
        seriesTeams = seriesTeams.filter((x) => x.points !== undefined)

        // assign places
        seriesTeams.forEach(this.assignPlaces);

        return new Computed_Cascade_ManyTeamPointed(this.id,this.name,seriesTeams);
    }

    private assignSeriesPoints(seriesTeam:ManyRaceTeamResult) {
        const MAX_RACES = 4;
        let scoringResults:SingleRaceTeamResult[] = seriesTeam.raceResults.filter(isSingleRaceTeamResult)
        scoringResults.sort(compareSingleTeamByPointsHighestFirst)
        const size = scoringResults.length > MAX_RACES ? MAX_RACES : scoringResults.length
        scoringResults = scoringResults
            .slice(0,size) // only top MAX_RACES
            .filter((r) => !(r.points === undefined));
        if (scoringResults.length === 0) {
            seriesTeam.points = undefined;
            return;
        }
        // Set is contributing flag
        scoringResults.forEach((x) => {
            const contributingIndex = seriesTeam.resultsSummary.findIndex((y)=>y.isContributing===false && x.points ===y.points);
            seriesTeam.resultsSummary[contributingIndex].isContributing = true;
        });
        seriesTeam.points = scoringResults.reduce((score:number, r) => score + r.points!, 0);
        return;
    }

    private assignPlaces(
        seriesTeam:ManyRaceTeamResult,
        index:number,
        results:ManyRaceTeamResult[]
    ): void {
        if (seriesTeam.points === undefined) {
            return;
        }
        if (index === 0) {
            seriesTeam.place = 1;
            return;
        } else {
            if (compareManyTeamHighestFirst(seriesTeam, results[index-1]) === 0) {
                seriesTeam.place = results[index - 1].place;
                return;
            } else {
                seriesTeam.place = index + 1;
                return;
            }
        }
    }
}

function compareManyTeamHighestFirst(a:ManyRaceTeamResult, b:ManyRaceTeamResult) {
    // Zero is a falsy value, but zero is a valid score! Check explicitly for undefined.
    // Do NOT simply check for existence `if (a.points)` returns false when a.points === 0.
    // But a score of zero MUST rank ahead of a score of undefined or things break.

    // NOTE: this exact same algo is in Cascade_ManySoloWorldCup!
    // There's maybe an argument for both to exist if tiebreak rules diverge.
    // Likely if making updates here, make updates there too!

    if (a.points !== undefined && b.points !== undefined) {
        if (a.points !== b.points) {
            return b.points - a.points;
        }
        // points are tied, look at each score best to worst (does not care about MAX_RACES)
        // TODO: this is missing the case where double 0 should rank above single 0.
        // It's treating those as equals. What about other similar cases?
        const aScores:SingleRaceTeamResult[] = a.raceResults.filter(isSingleRaceTeamResult)
            .filter((x) => x.points !== undefined)
            .sort((c,d) => (d.points! - c.points!))
        const bScores:SingleRaceTeamResult[] = b.raceResults.filter(isSingleRaceTeamResult)
            .filter((x) => x.points !== undefined)
            .sort((c,d) => (d.points! - c.points!))
        const minScores = Math.min(aScores.length, bScores.length)
        for (let i=0; i<minScores; i++) {
            if (aScores[i].points !== bScores[i].points) {
                return bScores[i].points! - aScores[i].points!
            }
        }
        if (aScores[minScores+1]) {return -1}
        else if (bScores[minScores+1]) {return 1}
        else {return 0}
    }
    if (a.points !== undefined) {
        return -1;
    } else if (b.points !== undefined) {
        return 1;
    } else {
        return 0;
    }
}