import { CompetitionClassType, IndividualScoreMethod, MultiEventScoreMethod, MultiEventScoreMethodDefinition, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";

export const CascadeWinter2024Series = new CompetitionPreset("COC Winter League");

const CascadeWinterSeriesScoreMethod = new MultiEventScoreMethodDefinition(
    MultiEventScoreMethod.SumNTiebreakAll,
    1, // minRaces
    4  // contributingRaces
);


// Public Short Advanced 
CascadeWinter2024Series.addClass({
    Name: "Short Advanced Female Series",
    ClassCodes: ["8F"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Multi: CascadeWinterSeriesScoreMethod
})
CascadeWinter2024Series.addClass({
    Name: "Short Advanced Open Series",
    ClassCodes: ["8O"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Multi: CascadeWinterSeriesScoreMethod
})


// Public Long Advanced
CascadeWinter2024Series.addClass({
    Name: "Long Advanced Female Series",
    ClassCodes: ["9F"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Multi: CascadeWinterSeriesScoreMethod
})
CascadeWinter2024Series.addClass({
    Name: "Long Advanced Open Series",
    ClassCodes: ["9O"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Multi: CascadeWinterSeriesScoreMethod
})

