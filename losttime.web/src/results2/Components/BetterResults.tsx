import { useState } from "react";
import { PageTitle } from "../../shared/PageTitle";
import { FileLoader } from "./FileLoader";
import { CompetitionClassComposer } from "./CompetitionClassComposer";
import { CompetitionClass } from "../CompetitionClass";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";

export function BetterResults() {

    const [raceClasses, setRaceClasses] = useState<Map<Guid,Map<string,StandardRaceClassData>>>(new Map());
    // const [competitionClasses, setCompetitionClasses] = useState<CompetitionClass[]>([])

    return (
        <div>
        <PageTitle title="Better Results" />
        <FileLoader 
            setRaceClasses={setRaceClasses}/>
        <CompetitionClassComposer 
            raceClassesByRace={raceClasses}/>
        </div>
    )
};