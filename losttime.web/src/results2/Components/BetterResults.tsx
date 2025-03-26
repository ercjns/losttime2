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
        <p>Create results that match your website's styles. Customize the names of classes and the order they're listed. Combine multiple events into multi-day results or series results (under development). Apply your club's unique scoring algorithms (requests welcome!). </p>
        <FileLoader 
            raceClassesByRace={raceClasses}
            setRaceClasses={setRaceClasses}
            setCompetitionClasses={setCompetitionClasses}
        />
        <CompetitionClassComposer 
            raceClassesByRace={raceClasses}
            competitionClasses={competitionClasses}
            setCompetitionClasses={setCompetitionClasses}
        />
        <OutputBuilder
            competitionClasses={competitionClasses}
            setCompetitionClasses={setCompetitionClasses}
        />
        </div>
    )
};