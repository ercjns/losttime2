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

        console.log('solos:', solos.length)
        // compute series score
        solos.forEach(this.assignSeriesPoints)

        // order by points
        solos.sort(compareManySoloHighestFirst);

        // assign places
        solos.forEach(this.assignPlaces);

        return new Computed_Cascade_ManySoloPointed(this.id,this.name,solos);
    }

    private assignSeriesPoints(seriesSolo:ManyRaceSoloResult) {
        const MAX_RACES = 4;
        let scoringResults:SingleRaceSoloResult[] = seriesSolo.raceResults.filter(isSingleRaceSoloResult)
        scoringResults.sort(compareSingleSoloPointedByPointsHighestFirst)
        const size = scoringResults.length > MAX_RACES ? MAX_RACES : scoringResults.length
        scoringResults
            .slice(0,size) // only top MAX_RACES
            .filter((r) => !(r.points===null || r.points===undefined))
        if (scoringResults.length === 0) {
            seriesSolo.points = undefined;
            return;
        }
        seriesSolo.points = scoringResults.reduce((score:number, r) => score + r.points!, 0)
    }

    private assignPlaces(
        seriesSolo:ManyRaceSoloResult,
        index:number,
        results:ManyRaceSoloResult[]
    ): void {
        if (index === 0) {
            seriesSolo.place = 1
        } else {
            if (compareManySoloHighestFirst(seriesSolo, results[index-1]) === 0) {
                seriesSolo.place = results[index - 1].place;
            } else {
                seriesSolo.place = index + 1;
            }
        }
    }
}

function compareManySoloHighestFirst(a:ManyRaceSoloResult, b:ManyRaceSoloResult) {
    if (a.points && b.points) {
        if (a.points !== b.points) {
            return b.points - a.points;
        }
        // points are tied, look at each score best to worst (does not care about MAX_RACES)
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
    if (a.points) {
        return -1;
    } else if (b.points) {
        return 1;
    } else {
        return 0;
    }
}