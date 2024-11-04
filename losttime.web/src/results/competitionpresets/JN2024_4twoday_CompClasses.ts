import { CompetitionClassType, IndividualScoreMethod, MultiEventScoreMethod, MultiEventScoreMethodDefinition, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";
import { TeamLevel } from "./teamdefinition";


export const JN4twoday = new CompetitionPreset("JN2024 Two Day Combined");

// IS and IC Classes, two day results
// A.35.4.2 Team Scoring: The best three scores from each race for each team are combined for a team score. Lowest overall team score wins.
// A.35.4.3 Individual Scoring: The scores from each race are combined for each individual. Lowest combined score wins.

// ALL OTHER CLASSES, two day results
// A.20.4.5 CLASSIC: Lowest total time over multiple races determines winner.
// ADULT NRE Categories
// COLOR NRE Categories
// REC categories
// NO 2-day results for JUNIOR NRE categories (because IS/IC categories)

// order will be like
// ISPF, ISPM, ISP-TEAMS, ... ICVF, ICVM, ICV-TEAMS
// Then everything else follows as normal:
// F-10, M-10, F-12, M-12, ... F-21+, M-21+, ... F95+, M95+,
// M/F-White, F-Yellow, M-Yellow, ... M-Red,
// Rec White, Rec Yellow, ... Rec Blue


const OusaMultiRaceIndvScoreMethod = new MultiEventScoreMethodDefinition(
    // This multi-score method doesn't care if points are 
    // OUSA points or simply times
    // It's just looking to Sum All two.
    // lowest wins for both OUSA AWT points and combined time.
    // So this works for both IS/IC and for normal classes.
    MultiEventScoreMethod.SumAll,
    2, // minRaces
    2  // contributingRaces
);

// SCHOLASTIC CLASSES

JN4twoday.addClass({
    Name: "Female Interscholastic Primary",
    ClassCodes: ["ISPF"],
    PairedClassCodes: ["ISPM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Interscholastic Primary",
    ClassCodes: ["ISPM"],
    PairedClassCodes: ["ISPF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Interscholastic Primary Teams",
//     ClassCodes: ["ISPF","ISPM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.Primary
// })

JN4twoday.addClass({
    Name: "Female Interscholastic Intermediate",
    ClassCodes: ["ISIF"],
    PairedClassCodes: ["ISIM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Interscholastic Intermediate",
    ClassCodes: ["ISIM"],
    PairedClassCodes: ["ISIF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Interscholastic Intermediate Teams",
//     ClassCodes: ["ISIF","ISIM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.Intermediate
// })

JN4twoday.addClass({
    Name: "Female Interscholastic Junior Varsity",
    ClassCodes: ["ISJVF"],
    PairedClassCodes: ["ISJVM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Interscholastic Junior Varsity",
    ClassCodes: ["ISJVM"],
    PairedClassCodes: ["ISJVF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Interscholastic Junior Varsity Teams",
//     ClassCodes: ["ISJVF","ISJVM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.SchoolJrVarsity
// })

JN4twoday.addClass({
    Name: "Female Interscholastic Varsity",
    ClassCodes: ["ISVF"],
    PairedClassCodes: ["ISVM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Interscholastic Varsity",
    ClassCodes: ["ISVM"],
    PairedClassCodes: ["ISVF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Interscholastic Varsity Teams",
//     ClassCodes: ["ISVF","ISVM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.SchoolVarsity
// })

// COLLEGIATE CLASSES

JN4twoday.addClass({
    Name: "Female Intercollegiate Junior Varsity",
    ClassCodes: ["ICJVF"],
    PairedClassCodes: ["ICJVM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Intercollegiate Junior Varsity",
    ClassCodes: ["ICJVM"],
    PairedClassCodes: ["ICJVF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Intercollegiate Junior Varsity Teams",
//     ClassCodes: ["ICJVF","ICJVM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.CollegeJrVarsity
// })

JN4twoday.addClass({
    Name: "Female Intercollegiate Varsity",
    ClassCodes: ["ICVF"],
    PairedClassCodes: ["ICVM"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Male Intercollegiate Varsity",
    ClassCodes: ["ICVM"],
    PairedClassCodes: ["ICVF"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
// JN4twoday.addClass({
//     Name: "Intercollegiate Varsity Teams",
//     ClassCodes: ["ICVF","ICVM"],
//     // PairedClassCodes not required, they are interpreted from ClassCodes.
//     CompClassType: CompetitionClassType.OneRaceTeam,
//     ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
//     ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
//     TeamLevel: TeamLevel.CollegeVarsity
// })



// JUNIOR AGE CLASSES
// None of these - Only IS/IC two day classes for Juniors

// OPEN

JN4twoday.addClass({
    Name: "F-21+",
    ClassCodes: ["F-21+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M-21+",
    ClassCodes: ["M-21+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

// ADULT AGE CLASSES

JN4twoday.addClass({
    Name: "F35+",
    ClassCodes: ["F35+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M35+",
    ClassCodes: ["M35+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F40+",
    ClassCodes: ["F40+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M40+",
    ClassCodes: ["M40+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F45+",
    ClassCodes: ["F45+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M45+",
    ClassCodes: ["M45+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F50+",
    ClassCodes: ["F50+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M50+",
    ClassCodes: ["M50+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F55+",
    ClassCodes: ["F55+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M55+",
    ClassCodes: ["M55+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F60+",
    ClassCodes: ["F60+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M60+",
    ClassCodes: ["M60+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F65+",
    ClassCodes: ["F65+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M65+",
    ClassCodes: ["M65+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F70+",
    ClassCodes: ["F70+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M70+",
    ClassCodes: ["M70+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F75+",
    ClassCodes: ["F75+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M75+",
    ClassCodes: ["M75+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F80+",
    ClassCodes: ["F80+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M80+",
    ClassCodes: ["M80+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F85+",
    ClassCodes: ["F85+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M85+",
    ClassCodes: ["M85+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F90+",
    ClassCodes: ["F90+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M90+",
    ClassCodes: ["M90+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F95+",
    ClassCodes: ["F95+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M95+",
    ClassCodes: ["M95+"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

// COLOR CLASSES

JN4twoday.addClass({
    Name: "M/F-White",
    ClassCodes: ["M/F-White"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F-Yellow",
    ClassCodes: ["F-Yellow"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M-Yellow",
    ClassCodes: ["M-Yellow"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F-Orange",
    ClassCodes: ["F-Orange"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M-Orange",
    ClassCodes: ["M-Orange"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F-Brown",
    ClassCodes: ["F-Brown"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M-Brown",
    ClassCodes: ["M-Brown"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "F-Green",
    ClassCodes: ["F-Green"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "M-Green",
    ClassCodes: ["M-Green"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

JN4twoday.addClass({
    Name: "M-Red",
    ClassCodes: ["M-Red"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})

// RECREATIONAL CLASSES

JN4twoday.addClass({
    Name: "Recreational White",
    ClassCodes: ["Rec-White"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Yellow",
    ClassCodes: ["Rec-Yellow"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Orange",
    ClassCodes: ["Rec-Orange"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Brown",
    ClassCodes: ["Rec-Brown"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Green",
    ClassCodes: ["Rec-Green"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Red",
    ClassCodes: ["Rec-Red"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})
JN4twoday.addClass({
    Name: "Recreational Blue",
    ClassCodes: ["Rec-Blue"],
    CompClassType: CompetitionClassType.ManyRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time,
    ScoreMethod_Multi: OusaMultiRaceIndvScoreMethod
})