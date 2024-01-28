import { CompetitionClassType, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";

export const CocWinterLeauge = new CompetitionPreset("COC Winter League");

// Public Non-Competitive
CocWinterLeauge.addClass({
    Name: "Beginner",
    ClassCodes: ["1"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CocWinterLeauge.addClass({
    Name: "Advanced Beginner",
    ClassCodes: ["2"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CocWinterLeauge.addClass({
    Name: "Intermediate",
    ClassCodes: ["4"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Short Advanced 
CocWinterLeauge.addClass({
    Name: "Short Advanced Female",
    ClassCodes: ["7F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Short Advanced Open",
    ClassCodes: ["7O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Short Advanced Groups",
    ClassCodes: ["7G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Long Advanced
CocWinterLeauge.addClass({
    Name: "Long Advanced Female",
    ClassCodes: ["8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Long Advanced Open",
    ClassCodes: ["8O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Long Advanced Groups",
    ClassCodes: ["8G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Elementary
CocWinterLeauge.addClass({
    Name: "Elementary Female",
    ClassCodes: ["W1F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Elementary Male",
    ClassCodes: ["W1M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
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
CocWinterLeauge.addClass({
    Name: "Middle School Female",
    ClassCodes: ["W2F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Middle School Male",
    ClassCodes: ["W2M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
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
CocWinterLeauge.addClass({
    Name: "High School JV Rookie Female",
    ClassCodes: ["W3F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School JV Rookie Male",
    ClassCodes: ["W3M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School JV Rookie Teams",
    ClassCodes: ["W3M","W3F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// JV
CocWinterLeauge.addClass({
    Name: "High School JV Female",
    ClassCodes: ["W4F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School JV Female Teams",
    ClassCodes: ["W4F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})
CocWinterLeauge.addClass({
    Name: "High School JV Male",
    ClassCodes: ["W5M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School JV Male Teams",
    ClassCodes: ["W5M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// Varsity
CocWinterLeauge.addClass({
    Name: "High School Varsity Female",
    ClassCodes: ["W6F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School Varsity Male",
    ClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "High School Varsity Teams",
    ClassCodes: ["W6F", "W6M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// College
CocWinterLeauge.addClass({
    Name: "Collegiate Varsity Female",
    ClassCodes: ["W8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Collegiate Varsity Male",
    ClassCodes: ["W8M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeauge.addClass({
    Name: "Collegiate Varsity Teams",
    ClassCodes: ["W8F", "W8M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})