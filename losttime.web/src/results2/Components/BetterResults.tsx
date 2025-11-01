import { useState } from "react";
import { PageTitle } from "../../shared/PageTitle";
import { FileLoader, RaceResultsData } from "./FileLoader";
import { CompetitionClassComposer } from "./Compose/CompetitionClassComposer";
import { CompetitionClass } from "../CompetitionClass/CompetitionClass";
import { OutputBuilder } from "./Output/OutputBuilder";

export function BetterResults() {

    const [raceResultsData, setRaceResultsData] = useState<RaceResultsData[]>([]);
    const [competitionClasses, setCompetitionClasses] = useState<CompetitionClass[]>([])

    return (
        <div>
        <PageTitle title="Better Results" />
        <p>Create results that match your website's styles. Customize the names of classes and the order they're listed. Combine multiple events into multi-day results or series results (under development). Apply your club's unique scoring algorithms (requests welcome!). </p>
        <FileLoader 
            raceResultsData={raceResultsData}
            setRaceResultsData={setRaceResultsData}
            setCompetitionClasses={setCompetitionClasses}
        />
        <CompetitionClassComposer 
            raceResultsData={raceResultsData}
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