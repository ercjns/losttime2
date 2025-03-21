import { Computed_Cascade_SingleTeamPointed } from "../../ComputedCompetitionClass/Computed_Cascade_SingleTeamPointed";
import { CompetitionClass } from "../CompetitionClass";
import { SingleRaceTeamResult } from "../SingleRaceTeamResult";
import { SingleRaceSoloPointedResult } from "../SingleRaceSoloPointedResult";
import { Cascade_SingleSoloWorldCup } from "./Cascade_SingleSoloWorldCup";
import { CompetitiveStatus } from "../../../results/scoremethods/IofStatusParser";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";

export class Cascade_SingleTeamWorldCup extends CompetitionClass {

    competitionClassType = CompetitionClassType.SingleEventTeam;
    scoreMethod = Results2ScoreMethod.SingleTeam_Cascade_WorldCup;

    scoreMethodFriendly(): string {
        return 'Team - CascadeOC World Cup'
    }

    compute():Computed_Cascade_SingleTeamPointed {
        let solos:SingleRaceSoloPointedResult[] = []
        this.contributingResults.forEach((c) => {
            //score each class individually
            const scored = new Cascade_SingleSoloWorldCup(c.xmlClass.ShortName, [c])
                .compute()
            solos.push(...scored.results)
        })

        // determine all possible teams
        const teamNames = solos.reduce((teams:string[],r): string[] => 
            teams.some((x) => x === r.club) ? teams : [...teams, r.club]
        , [])

        // create team result if more than one result for that team.
        let teams:SingleRaceTeamResult[] = []
        teamNames.forEach((t) => {
            const members = solos.filter((x) => x.club === t 
                && x.competitive !== CompetitiveStatus.NC);
            if (members.length > 1) {
                teams.push(new SingleRaceTeamResult(members, t, t))
            }
        })

        // score the teams
        teams.forEach(this.assignPointsWiolTeams);

        // order by points
        teams.sort(compareSingleTeamHighestFirst);

        // assign places
        teams.forEach(this.assignPlaces);

        // done!
        return new Computed_Cascade_SingleTeamPointed(this.id, this.name, teams);
    }

    private assignPointsWiolTeams(team:SingleRaceTeamResult): void {
        team.soloResultsAll.sort(compareSingleSoloPointedByPointsHighestFirst)
        console.log(team)
        const size = team.soloResultsAll.length > 3 ? 3 : team.soloResultsAll.length
        team.soloResults = team.soloResultsAll
            .slice(0,size) // only top 3 max
            .filter((r) => !(r.points===null || r.points===undefined))
        if (team.soloResults.length === 0) {
            team.points = null;
            return;
        }
        team.points = team.soloResults.reduce((score:number, r) => score + r.points!, 0)
    }

    private assignPlaces(
        item:SingleRaceTeamResult,
        index:number,
        results:SingleRaceTeamResult[]
    ): void {
        if (index === 0) {
            item.place = 1
        } else {
            if (compareSingleTeamHighestFirst(item, results[index-1]) === 0) {
                item.place = results[index - 1].place;
            } else {
                item.place = index + 1;
            }
        }
    }


}

function compareSingleSoloPointedByPointsHighestFirst(a:SingleRaceSoloPointedResult, b:SingleRaceSoloPointedResult) {
    if (a.points && b.points) {
        return b.points - a.points;
    }
    if (a.points) {
        return -1;
    } else if (b.points) {
        return 1;
    } else {
        return 0;
    }
}

function compareSingleTeamHighestFirst(a:SingleRaceTeamResult, b:SingleRaceTeamResult) {
    if (a.points && b.points) {
        if (a.points !== b.points) {
            return b.points - a.points;
        }
        const minContributors = Math.min(a.soloResults.length, b.soloResults.length);
        for (let i = 0; i < minContributors; i++) {
            if (a.soloResults[i].points !== b.soloResults[i].points) {
                return b.soloResults[i].points! - a.soloResults[i].points!
            }
        }
        if (a.soloResults[minContributors+1]) {return -1}
        else if (b.soloResults[minContributors+1]) {return 1}
        else {return 0}
    }
    if (a.points) {
        return -1;
    } else if (b.points) {
        return 1;
    } else {
        return 0;
    }
}