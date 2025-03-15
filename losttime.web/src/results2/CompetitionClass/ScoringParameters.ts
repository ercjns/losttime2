import { IndividualScoreMethod } from "../../results/CompetitionClass"



export class ScoringParameters {
    individual:IndividualScoreMethod;
    
    constructor(individual:IndividualScoreMethod=IndividualScoreMethod.Time) {
        this.individual = individual;
    }

}