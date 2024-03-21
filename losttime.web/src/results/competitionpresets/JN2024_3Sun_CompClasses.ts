import { CompetitionClassType, IndividualScoreMethod, TeamCollationMethod, TeamScoreMethod, TeamScoreMethodDefinition } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";
import { TeamLevel } from "./teamdefinition";


export const JN3Sunday = new CompetitionPreset("JN2024 Sunday");

// Sunday is JN day two.
// IS and IC Classes, including single day team results. These are pointed.
// ALL NRE Categories single day results
// PLUS Recreational classes single day

// THIS DOES NOT INCLUE TWO DAY RESULTS
// TWO DAY RESULTS MUST BE SEPARATE AS THERES NO WAY FOR THIS SYSTEM TO 
// EXCLUDE RESULTS THAT ARE PROVIDED IN THE UPLOAD IF THEY MATCH THE CLASSES
// CONFIGURED 

// order will be like
// ISPF, ISPM, ISP-TEAMS, ... ICVF, ICVM, ICV-TEAMS
// Then everything else follows as normal:
// F-10, M-10, F-12, M-12, ... F-21+, M-21+, ... F95+, M95+,
// M/F-White, F-Yellow, M-Yellow, ... M-Red,
// Rec White, Rec Yellow, ... Rec Blue

const OusaOneRaceTeamScoreMethod = new TeamScoreMethodDefinition(
    3, // minResults
    5, // maxResults
    TeamScoreMethod.SumMinLowestWins,
    TeamCollationMethod.ScoreThenCombine
);

// SCHOLASTIC CLASSES

JN3Sunday.addClass({
    Name: "Female Interscholastic Primary",
    ClassCodes: ["ISPF"],
    PairedClassCodes: ["ISPM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Interscholastic Primary",
    ClassCodes: ["ISPM"],
    PairedClassCodes: ["ISPF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Interscholastic Primary Teams",
    ClassCodes: ["ISPF","ISPM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.Primary
})

JN3Sunday.addClass({
    Name: "Female Interscholastic Intermediate",
    ClassCodes: ["ISIF"],
    PairedClassCodes: ["ISIM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Interscholastic Intermediate",
    ClassCodes: ["ISIM"],
    PairedClassCodes: ["ISIF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Interscholastic Intermediate Teams",
    ClassCodes: ["ISIF","ISIM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.Intermediate
})

JN3Sunday.addClass({
    Name: "Female Interscholastic Junior Varsity",
    ClassCodes: ["ISJVF"],
    PairedClassCodes: ["ISJVM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Interscholastic Junior Varsity",
    ClassCodes: ["ISJVM"],
    PairedClassCodes: ["ISJVF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Interscholastic Junior Varsity Teams",
    ClassCodes: ["ISJVF","ISJVM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.SchoolJrVarsity
})

JN3Sunday.addClass({
    Name: "Female Interscholastic Varsity",
    ClassCodes: ["ISVF"],
    PairedClassCodes: ["ISVM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Interscholastic Varsity",
    ClassCodes: ["ISVM"],
    PairedClassCodes: ["ISVF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Interscholastic Varsity Teams",
    ClassCodes: ["ISVF","ISVM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.SchoolVarsity
})

// COLLEGIATE CLASSES

JN3Sunday.addClass({
    Name: "Female Intercollegiate Junior Varsity",
    ClassCodes: ["ICJVF"],
    PairedClassCodes: ["ICJVM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Intercollegiate Junior Varsity",
    ClassCodes: ["ICJVM"],
    PairedClassCodes: ["ICJVF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Intercollegiate Junior Varsity Teams",
    ClassCodes: ["ICJVF","ICJVM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.CollegeJrVarsity
})

JN3Sunday.addClass({
    Name: "Female Intercollegiate Varsity",
    ClassCodes: ["ICVF"],
    PairedClassCodes: ["ICVM"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Male Intercollegiate Varsity",
    ClassCodes: ["ICVM"],
    PairedClassCodes: ["ICVF"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime
})
JN3Sunday.addClass({
    Name: "Intercollegiate Varsity Teams",
    ClassCodes: ["ICVF","ICVM"],
    // PairedClassCodes not required, they are interpreted from ClassCodes.
    CompClassType: CompetitionClassType.OneRaceTeam,
    ScoreMethod: IndividualScoreMethod.PointsOusaAverageWinningTime,
    ScoreMethod_Team: OusaOneRaceTeamScoreMethod,
    TeamLevel: TeamLevel.CollegeVarsity
})



// JUNIOR AGE CLASSES

JN3Sunday.addClass({
    Name: "F-10",
    ClassCodes: ["F-10"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-10",
    ClassCodes: ["M-10"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-12",
    ClassCodes: ["F-12"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-12",
    ClassCodes: ["M-12"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-14",
    ClassCodes: ["F-14"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-14",
    ClassCodes: ["M-14"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-16",
    ClassCodes: ["F-16"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-16",
    ClassCodes: ["M-16"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-18",
    ClassCodes: ["F-18"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-18",
    ClassCodes: ["M-18"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-20",
    ClassCodes: ["F-20"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-20",
    ClassCodes: ["M-20"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// OPEN

JN3Sunday.addClass({
    Name: "F-21+",
    ClassCodes: ["F-21+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-21+",
    ClassCodes: ["M-21+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// ADULT AGE CLASSES

JN3Sunday.addClass({
    Name: "F35+",
    ClassCodes: ["F35+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M35+",
    ClassCodes: ["M35+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F40+",
    ClassCodes: ["F40+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M40+",
    ClassCodes: ["M40+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F45+",
    ClassCodes: ["F45+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M45+",
    ClassCodes: ["M45+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F50+",
    ClassCodes: ["F50+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M50+",
    ClassCodes: ["M50+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F55+",
    ClassCodes: ["F55+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M55+",
    ClassCodes: ["M55+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F60+",
    ClassCodes: ["F60+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M60+",
    ClassCodes: ["M60+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F65+",
    ClassCodes: ["F65+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M65+",
    ClassCodes: ["M65+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F70+",
    ClassCodes: ["F70+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M70+",
    ClassCodes: ["M70+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F75+",
    ClassCodes: ["F75+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M75+",
    ClassCodes: ["M75+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F80+",
    ClassCodes: ["F80+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M80+",
    ClassCodes: ["M80+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F85+",
    ClassCodes: ["F85+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M85+",
    ClassCodes: ["M85+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F90+",
    ClassCodes: ["F90+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M90+",
    ClassCodes: ["M90+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F95+",
    ClassCodes: ["F95+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M95+",
    ClassCodes: ["M95+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// COLOR CLASSES

JN3Sunday.addClass({
    Name: "M/F-White",
    ClassCodes: ["M/F-White"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-Yellow",
    ClassCodes: ["F-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-Yellow",
    ClassCodes: ["M-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-Orange",
    ClassCodes: ["F-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-Orange",
    ClassCodes: ["M-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-Brown",
    ClassCodes: ["F-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-Brown",
    ClassCodes: ["M-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "F-Green",
    ClassCodes: ["F-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "M-Green",
    ClassCodes: ["M-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN3Sunday.addClass({
    Name: "M-Red",
    ClassCodes: ["M-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// RECREATIONAL CLASSES

JN3Sunday.addClass({
    Name: "Recreational White",
    ClassCodes: ["Rec-White"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Yellow",
    ClassCodes: ["Rec-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Orange",
    ClassCodes: ["Rec-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Brown",
    ClassCodes: ["Rec-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Green",
    ClassCodes: ["Rec-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Red",
    ClassCodes: ["Rec-Red"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN3Sunday.addClass({
    Name: "Recreational Blue",
    ClassCodes: ["Rec-Blue"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})