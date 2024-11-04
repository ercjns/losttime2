import { CompetitionClassType, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";

export const CascadeWinter2024Single = new CompetitionPreset("COC Winter League");

// Public Non-Competitive
CascadeWinter2024Single.addClass({
    Name: "Beginner",
    ClassCodes: ["1"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CascadeWinter2024Single.addClass({
    Name: "Advanced Beginner",
    ClassCodes: ["3"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CascadeWinter2024Single.addClass({
    Name: "Intermediate",
    ClassCodes: ["5"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Short Advanced 
CascadeWinter2024Single.addClass({
    Name: "Short Advanced Female",
    ClassCodes: ["8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Short Advanced Open",
    ClassCodes: ["8O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Short Advanced Groups",
    ClassCodes: ["8G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Long Advanced
CascadeWinter2024Single.addClass({
    Name: "Long Advanced Female",
    ClassCodes: ["9F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Long Advanced Open",
    ClassCodes: ["9O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Long Advanced Groups",
    ClassCodes: ["9G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Elementary
CascadeWinter2024Single.addClass({
    Name: "Elementary Female",
    ClassCodes: ["W1F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Elementary Male",
    ClassCodes: ["W1M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Elementary Teams",
    ClassCodes: ["W1M","W1F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// Middle School
CascadeWinter2024Single.addClass({
    Name: "Middle School Female",
    ClassCodes: ["W2F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Middle School Male",
    ClassCodes: ["W2M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Middle School Teams",
    ClassCodes: ["W2M","W2F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// JV Rookie
CascadeWinter2024Single.addClass({
    Name: "High School Rookie Female",
    ClassCodes: ["W3F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School Rookie Male",
    ClassCodes: ["W4M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School Rookie Teams",
    ClassCodes: ["W3F","W4M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// JV
CascadeWinter2024Single.addClass({
    Name: "High School JV Female",
    ClassCodes: ["W5F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School JV Female Teams",
    ClassCodes: ["W5F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})
CascadeWinter2024Single.addClass({
    Name: "High School JV Male",
    ClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School JV Male Teams",
    ClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// Varsity
CascadeWinter2024Single.addClass({
    Name: "High School Varsity Female",
    ClassCodes: ["W7F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School Varsity Male",
    ClassCodes: ["W7M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "High School Varsity Teams",
    ClassCodes: ["W7F", "W7M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// College
CascadeWinter2024Single.addClass({
    Name: "Collegiate JV Female",
    ClassCodes: ["W6F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Collegiate JV Male",
    ClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Collegiate Varsity Female",
    ClassCodes: ["W9F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Collegiate Varsity Male",
    ClassCodes: ["W9M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CascadeWinter2024Single.addClass({
    Name: "Collegiate Varsity Teams",
    ClassCodes: ["W9F", "W9M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})