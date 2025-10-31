import { LtPerson } from "../../../shared/orienteeringtypes/LtPerson";
import { CompetitionClassType, Results2ScoreMethod } from "../../CompetitionClassType";
import { Computed_Cascade_ManySoloPointed } from "../../ComputedCompetitionClass/Computed_Cascade_ManySoloWorldCup";
import { Computed_Cascade_SingleSoloPointed } from "../../ComputedCompetitionClass/Computed_Cascade_SingleSoloPointed";
import { CompetitionClass } from "../CompetitionClass";
import { ManyRaceSoloResult } from "../ManyRaceSoloResult";
import { compareSingleSoloPointedByPointsHighestFirst, isSingleRaceSoloResult, SingleRaceSoloResult } from "../SingleRaceSoloResult";
import { Cascade_SingleSoloWorldCup } from "./Cascade_SingleSoloWorldCup";


export class Cascade_ManySoloWorldCup extends CompetitionClass {

    competitionClassType = CompetitionClassType.MultiEventSolo;
    scoreMethod = Results2ScoreMethod.ManySolo_Cascade_WorldCup;

    scoreMethodFriendly(): string {
        return 'Series - Indv - CascadeOC Winter';
    }

    compute(): Computed_Cascade_ManySoloPointed {
        // Score each individual race class
        let scoredRaceClasses:Computed_Cascade_SingleSoloPointed[] = [];
        this.contributingResults.forEach((c) => {
            const scored = new Cascade_SingleSoloWorldCup(c.class.code, [c])
                .compute();
            scoredRaceClasses.push(scored);
        })
        
        // build series results - find all people:
        const persons = this.contributingResultsFlat().reduce((solos:LtPerson[],r): LtPerson[] =>
            (solos.some((x) => x.sameNameAndClubCode(r.person)) ? solos : [...solos, r.person])
            , [])

        // build series results - make a multi-result for each person
        let solos:ManyRaceSoloResult[] = []
        persons.forEach((p) => {
            let singleResults = Array<SingleRaceSoloResult|undefined>(scoredRaceClasses.length).fill(undefined)
            for (let [idx, c] of scoredRaceClasses.entries()) {
                const res = c.results.find((r) => r.person.sameNameAndClubCode(p));
                if (res) {singleResults[idx] = res;}
            }
            solos.push(new ManyRaceSoloResult(singleResults));
        });

        // compute series score
        solos.forEach(this.assignSeriesPoints);

        // order by points
        solos.sort(compareManySoloHighestFirst);

        // for series, remove people without points
        // series results should not include people
        // running NC all season
        solos = solos.filter((x) => x.points !== undefined)

        // assign places
        solos.forEach(this.assignPlaces);

        return new Computed_Cascade_ManySoloPointed(this.id,this.name,solos);
    }

    private assignSeriesPoints(seriesSolo:ManyRaceSoloResult) {
        const MAX_RACES = 4;
        let scoringResults:SingleRaceSoloResult[] = seriesSolo.raceResults.filter(isSingleRaceSoloResult)
        scoringResults.sort(compareSingleSoloPointedByPointsHighestFirst)
        const size = scoringResults.length > MAX_RACES ? MAX_RACES : scoringResults.length
        scoringResults = scoringResults
            .slice(0,size) // only top MAX_RACES
            .filter((r) => !(r.points === null || r.points === undefined));
        if (scoringResults.length === 0) {
            seriesSolo.points = undefined;
            return;
        }
        // Set is contributing flag
        scoringResults.forEach((x) => {
            const contributingIndex = seriesSolo.resultsSummary.findIndex((y)=>y.isContributing===false && x.points ===y.points);
            seriesSolo.resultsSummary[contributingIndex].isContributing = true;
        });
        seriesSolo.points = scoringResults.reduce((score:number, r) => score + r.points!, 0);
        return;
    }

    private assignPlaces(
        seriesSolo:ManyRaceSoloResult,
        index:number,
        results:ManyRaceSoloResult[]
    ): void {
        if (seriesSolo.points === undefined) {
            return;
        }
        if (index === 0) {
            seriesSolo.place = 1;
            return;
        } else {
            if (compareManySoloHighestFirst(seriesSolo, results[index-1]) === 0) {
                seriesSolo.place = results[index - 1].place;
                return;
            } else {
                seriesSolo.place = index + 1;
                return;
            }
        }
    }
}

function compareManySoloHighestFirst(a:ManyRaceSoloResult, b:ManyRaceSoloResult) {
    // Zero is a falsy value, but zero is a valid score! Check explicitly for undefined.
    // Do NOT simply check for existence `if (a.points)` returns false when a.points === 0.
    // But a score of zero MUST rank ahead of a score of undefined or things break.

    // NOTE: this exact same algo is in Cascade_ManyTeamWorldCup!
    // There's maybe an argument for both to exist if tiebreak rules diverge.
    // Likely if making updates here, make updates there too!

    if (a.points !== undefined && b.points !== undefined) {
        if (a.points !== b.points) {
            return b.points - a.points;
        }
        // points are tied, look at each score best to worst (does not care about MAX_RACES)
        // TODO: this is missing the case where double 0 should rank above single 0.
        // It's treating those as equals. What about other similar cases?
        const aScores:SingleRaceSoloResult[] = a.raceResults.filter(isSingleRaceSoloResult)
            .filter((x) => x.points !== undefined)
            .sort((c,d) => (d.points! - c.points!))
        const bScores:SingleRaceSoloResult[] = b.raceResults.filter(isSingleRaceSoloResult)
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