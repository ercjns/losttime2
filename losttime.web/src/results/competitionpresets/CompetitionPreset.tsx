import {CompetitionClassType, IndividualScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";

export class CompetitionPreset {
    PresetName: string;
    Classes: CompetitionClassPreset[]

    constructor(name:string, classes:CompetitionClassPreset[]=[]) {
        this.PresetName = name;
        this.Classes = classes;
        return;
    }

    addClass (preset:CompetitionClassPreset) {
        this.Classes.push(preset);
    }
}

export type CompetitionClassPreset  = {
    Name: string;
    ClassCodes: string[];
    PairedClassCodes?: string[];
    CompClassType: CompetitionClassType;
    ScoreMethod: IndividualScoreMethod;
    ScoreMethod_Team?: TeamScoreMethodDefinition;

    // constructor(name:string,
    //             classCodes:string[],
    //             compClassType:CompetitionClassType,
    //             scoreMethod:IndividualScoreMethod,
    //             scoreMethod_team:TeamScoreMethodDefinition|undefined=undefined) {
    //     this.Name = name;
    //     this.ClassCodes = classCodes;
    //     this.CompClassType = compClassType;
    //     this.ScoreMethod = scoreMethod;
    //     if (scoreMethod_team !== undefined) {
    //         this.ScoreMethod_Team = scoreMethod_team;
    //     }
    //     return;
    // }
}