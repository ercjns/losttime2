import { useState } from "react";
import { PageTitle } from "../../shared/PageTitle";
import { FileLoader } from "./FileLoader";
import { CompetitionClassComposer } from "./Compose/CompetitionClassComposer";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { CompetitionClass } from "../CompetitionClass/CompetitionClass";
import { OutputBuilder } from "./Output/OutputBuilder";

export function BetterResults() {

    const [raceClasses, setRaceClasses] = useState<Map<Guid,Map<string,StandardRaceClassData>>>(new Map());
    const [competitionClasses, setCompetitionClasses] = useState<CompetitionClass[]>([])

    return (
        <div>
        <PageTitle title="Better Results" />
        <FileLoader 
            setRaceClasses={setRaceClasses}
        />
        <CompetitionClassComposer 
            raceClassesByRace={raceClasses}
            setCompetitionClasses={setCompetitionClasses}
        />
        <OutputBuilder
            competitionClasses={competitionClasses}
            setCompetitionClasses={setCompetitionClasses}
        />
        </div>
    )
};