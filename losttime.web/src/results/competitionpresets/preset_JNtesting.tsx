import { CompetitionClassType, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";

export const CocWinterLeaugeTestingJN = new CompetitionPreset("COC Winter League");

// Public Non-Competitive
CocWinterLeaugeTestingJN.addClass({
    Name: "Beginner",
    ClassCodes: ["1"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Advanced Beginner",
    ClassCodes: ["2"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Intermediate",
    ClassCodes: ["4"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Short Advanced 
CocWinterLeaugeTestingJN.addClass({
    Name: "Short Advanced Female",
    ClassCodes: ["7F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Short Advanced Open",
    ClassCodes: ["7O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Short Advanced Groups",
    ClassCodes: ["7G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Public Long Advanced
CocWinterLeaugeTestingJN.addClass({
    Name: "Long Advanced Female",
    ClassCodes: ["8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Long Advanced Open",
    ClassCodes: ["8O"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Long Advanced Groups",
    ClassCodes: ["8G"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// Elementary
CocWinterLeaugeTestingJN.addClass({
    Name: "Elementary Female",
    ClassCodes: ["W1F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Elementary Male",
    ClassCodes: ["W1M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
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
CocWinterLeaugeTestingJN.addClass({
    Name: "Middle School Female",
    ClassCodes: ["W2F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Middle School Male",
    ClassCodes: ["W2M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
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
CocWinterLeaugeTestingJN.addClass({
    Name: "High School JV Rookie Female",
    ClassCodes: ["W3F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "High School JV Rookie Male",
    ClassCodes: ["W3M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
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
CocWinterLeaugeTestingJN.addClass({
    Name: "High School JV Female",
    ClassCodes: ["W4F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "High School JV Female Teams",
    ClassCodes: ["W4F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})
CocWinterLeaugeTestingJN.addClass({
    Name: "High School JV Male",
    ClassCodes: ["W5M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
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
CocWinterLeaugeTestingJN.addClass({
    Name: "High School Varsity Female",
    ClassCodes: ["W6F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "High School Varsity Male",
    ClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
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
CocWinterLeaugeTestingJN.addClass({
    Name: "Collegiate Varsity Female",
    ClassCodes: ["W8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Collegiate Varsity Male",
    ClassCodes: ["W8M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup
})
CocWinterLeaugeTestingJN.addClass({
    Name: "Collegiate Varsity Teams",
    ClassCodes: ["W8F", "W8M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsCocWorldCup,
    ScoreMethod_Team: new TeamScoreMethodDefinition(2,3,
        TeamScoreMethod.SumAllHighestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})


// Additional Classes to Score with AWT //

// Elementary
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Elementary Female",
    ClassCodes: ["W1F"],
    PairedClassCodes: ["W1M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Elementary Male",
    ClassCodes: ["W1M"],
    PairedClassCodes: ["W1F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Elementary Teams",
    ClassCodes: ["W1M","W1F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// Middle School
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Middle School Female",
    ClassCodes: ["W2F"],
    PairedClassCodes: ["W2M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Middle School Male",
    ClassCodes: ["W2M"],
    PairedClassCodes: ["W2F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Middle School Teams",
    ClassCodes: ["W2M","W2F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// JV Rookie
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Rookie Female",
    ClassCodes: ["W3F"],
    PairedClassCodes: ["W3M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Rookie Male",
    ClassCodes: ["W3M"],
    PairedClassCodes: ["W3F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Rookie Teams",
    ClassCodes: ["W3M","W3F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// JV
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Female",
    ClassCodes: ["W4F"],
    PairedClassCodes: ["W5M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Male",
    ClassCodes: ["W5M"],
    PairedClassCodes: ["W4F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School JV Teams",
    ClassCodes: ["W5M", "W4F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// Varsity
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School Varsity Female",
    ClassCodes: ["W6F"],
    PairedClassCodes: ["W6M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School Varsity Male",
    ClassCodes: ["W6M"],
    PairedClassCodes: ["W6F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST High School Varsity Teams",
    ClassCodes: ["W6F", "W6M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})

// College
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Collegiate Varsity Female",
    ClassCodes: ["W8F"],
    PairedClassCodes: ["W8M"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Collegiate Varsity Male",
    ClassCodes: ["W8M"],
    PairedClassCodes: ["W8F"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
CocWinterLeaugeTestingJN.addClass({
    Name: "AWT TEST Collegiate Varsity Teams",
    ClassCodes: ["W8F", "W8M"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
        TeamScoreMethod.SumMinLowestWins,
        TeamCollationMethod.ScoreThenCombine
    )
})