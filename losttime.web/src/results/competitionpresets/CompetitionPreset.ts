import {CompetitionClassType, IndividualScoreMethod, MultiEventScoreMethodDefinition, TeamScoreMethodDefinition } from "../CompetitionClass";
import { TeamLevel } from "./teamdefinition";

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
    ScoreMethod_Multi?: MultiEventScoreMethodDefinition;
    TeamLevel?: TeamLevel;
}