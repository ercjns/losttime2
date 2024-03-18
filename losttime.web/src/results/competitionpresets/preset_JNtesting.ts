import { CompetitionClassType, IndividualScoreMethod, MultiEventScoreMethod, MultiEventScoreMethodDefinition, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";
import { TeamLevel } from "./teamdefinition";

const OusaSingleTeamMethod = new TeamScoreMethodDefinition(3,5,
    TeamScoreMethod.SumMinLowestWins,
    TeamCollationMethod.ScoreThenCombine
);

const OusaMultiIndvMethod = new MultiEventScoreMethodDefinition(
    MultiEventScoreMethod.SumAll,
    2,
    2);

export const JNTesting = new CompetitionPreset("JN Testing");

// Elementary
// JNTesting.addClass({
//     Name: "AWT TEST Elementary Female",
//     ClassCodes: ["W1F"],
//     PairedClassCodes: ["W1M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST Elementary Male",
//     ClassCodes: ["W1M"],
//     PairedClassCodes: ["W1F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
JNTesting.addClass({
    Name: "AWT TEST Elementary Teams",
    ClassCodes: ["W1M","W1F"],
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaSingleTeamMethod,
    TeamLevel: TeamLevel.Primary
})

// // Elementary 2-day Results
// JNTesting.addClass({
//     Name: "AWT Test Elementary Female 2-day",
//     ClassCodes: ["W1F"],
//     PairedClassCodes: ["W1M"],
//     CompClassType: CompetitionClassType.ManyRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Multi: OusaMultiIndvMethod
// })
// JNTesting.addClass({
//     Name: "AWT TEST Elementary Male 2-day",
//     ClassCodes: ["W1M"],
//     PairedClassCodes: ["W1F"],
//     CompClassType: CompetitionClassType.ManyRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Multi: OusaMultiIndvMethod
// })
// JNTesting.addClass({
//     Name: "AWT TEST Elementary Teams 2-day",
//     ClassCodes: ["W1M","W1F"],
//     CompClassType: CompetitionClassType.ManyRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaSingleTeamMethod,
//     ScoreMethod_Multi: OusaMultiIndvMethod 
// })



// // Middle School
// JNTesting.addClass({
//     Name: "AWT TEST Middle School Female",
//     ClassCodes: ["W2F"],
//     PairedClassCodes: ["W2M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST Middle School Male",
//     ClassCodes: ["W2M"],
//     PairedClassCodes: ["W2F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST Middle School Teams",
//     ClassCodes: ["W2M","W2F"],
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
//         TeamScoreMethod.SumMinLowestWins,
//         TeamCollationMethod.ScoreThenCombine
//     )
// })

// // JV Rookie
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Rookie Female",
//     ClassCodes: ["W3F"],
//     PairedClassCodes: ["W3M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Rookie Male",
//     ClassCodes: ["W3M"],
//     PairedClassCodes: ["W3F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Rookie Teams",
//     ClassCodes: ["W3M","W3F"],
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
//         TeamScoreMethod.SumMinLowestWins,
//         TeamCollationMethod.ScoreThenCombine
//     )
// })

// // JV
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Female",
//     ClassCodes: ["W4F"],
//     PairedClassCodes: ["W5M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Male",
//     ClassCodes: ["W5M"],
//     PairedClassCodes: ["W4F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School JV Teams",
//     ClassCodes: ["W5M", "W4F"],
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
//         TeamScoreMethod.SumMinLowestWins,
//         TeamCollationMethod.ScoreThenCombine
//     )
// })

// // Varsity
// JNTesting.addClass({
//     Name: "AWT TEST High School Varsity Female",
//     ClassCodes: ["W6F"],
//     PairedClassCodes: ["W6M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School Varsity Male",
//     ClassCodes: ["W6M"],
//     PairedClassCodes: ["W6F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST High School Varsity Teams",
//     ClassCodes: ["W6F", "W6M"],
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
//         TeamScoreMethod.SumMinLowestWins,
//         TeamCollationMethod.ScoreThenCombine
//     )
// })

// // College
// JNTesting.addClass({
//     Name: "AWT TEST Collegiate Varsity Female",
//     ClassCodes: ["W8F"],
//     PairedClassCodes: ["W8M"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST Collegiate Varsity Male",
//     ClassCodes: ["W8M"],
//     PairedClassCodes: ["W8F"],
//     CompClassType: CompetitionClassType.OneRaceIndv,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
// })
// JNTesting.addClass({
//     Name: "AWT TEST Collegiate Varsity Teams",
//     ClassCodes: ["W8F", "W8M"],
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: new TeamScoreMethodDefinition(3,5,
//         TeamScoreMethod.SumMinLowestWins,
//         TeamCollationMethod.ScoreThenCombine
//     )
// })