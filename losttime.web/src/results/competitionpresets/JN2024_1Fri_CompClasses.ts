import { CompetitionClassType, IndividualScoreMethod } from "../CompetitionClass";
import { CompetitionPreset } from "./CompetitionPreset";


export const JN1Friday = new CompetitionPreset("JN2024 Friday");

// Friday is a standard OUSA NRE and uses those classes
// PLUS Recreational classes

// order will be like
// F-10, M-10, F-12, M-12, ... F-21+, M-21+, ... F95+, M95+,
// M/F-White, F-Yellow, M-Yellow, ... M-Red,
// Rec White, Rec Yellow, ... Rec Blue

// There is no scoring, just total times.
// There are no teams


// JUNIOR AGE CLASSES

JN1Friday.addClass({
    Name: "F-10",
    ClassCodes: ["F-10"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-10",
    ClassCodes: ["M-10"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-12",
    ClassCodes: ["F-12"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-12",
    ClassCodes: ["M-12"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-14",
    ClassCodes: ["F-14"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-14",
    ClassCodes: ["M-14"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-16",
    ClassCodes: ["F-16"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-16",
    ClassCodes: ["M-16"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-18",
    ClassCodes: ["F-18"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-18",
    ClassCodes: ["M-18"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-20",
    ClassCodes: ["F-20"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-20",
    ClassCodes: ["M-20"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// OPEN

JN1Friday.addClass({
    Name: "F-21+",
    ClassCodes: ["F-21+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-21+",
    ClassCodes: ["M-21+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// ADULT AGE CLASSES

JN1Friday.addClass({
    Name: "F35+",
    ClassCodes: ["F35+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M35+",
    ClassCodes: ["M35+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F40+",
    ClassCodes: ["F40+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M40+",
    ClassCodes: ["M40+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F45+",
    ClassCodes: ["F45+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M45+",
    ClassCodes: ["M45+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F50+",
    ClassCodes: ["F50+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M50+",
    ClassCodes: ["M50+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F55+",
    ClassCodes: ["F55+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M55+",
    ClassCodes: ["M55+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F60+",
    ClassCodes: ["F60+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M60+",
    ClassCodes: ["M60+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F65+",
    ClassCodes: ["F65+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M65+",
    ClassCodes: ["M65+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F70+",
    ClassCodes: ["F70+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M70+",
    ClassCodes: ["M70+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F75+",
    ClassCodes: ["F75+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M75+",
    ClassCodes: ["M75+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F80+",
    ClassCodes: ["F80+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M80+",
    ClassCodes: ["M80+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F85+",
    ClassCodes: ["F85+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M85+",
    ClassCodes: ["M85+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F90+",
    ClassCodes: ["F90+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M90+",
    ClassCodes: ["M90+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F95+",
    ClassCodes: ["F95+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M95+",
    ClassCodes: ["M95+"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// COLOR CLASSES

JN1Friday.addClass({
    Name: "M/F-White",
    ClassCodes: ["M/F-White"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-Yellow",
    ClassCodes: ["F-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-Yellow",
    ClassCodes: ["M-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-Orange",
    ClassCodes: ["F-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-Orange",
    ClassCodes: ["M-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-Brown",
    ClassCodes: ["F-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-Brown",
    ClassCodes: ["M-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "F-Green",
    ClassCodes: ["F-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "M-Green",
    ClassCodes: ["M-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

JN1Friday.addClass({
    Name: "M-Red",
    ClassCodes: ["M-Red"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})

// RECREATIONAL CLASSES

JN1Friday.addClass({
    Name: "Recreational White",
    ClassCodes: ["Rec-White"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Yellow",
    ClassCodes: ["Rec-Yellow"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Orange",
    ClassCodes: ["Rec-Orange"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Brown",
    ClassCodes: ["Rec-Brown"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Green",
    ClassCodes: ["Rec-Green"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Red",
    ClassCodes: ["Rec-Red"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})
JN1Friday.addClass({
    Name: "Recreational Blue",
    ClassCodes: ["Rec-Blue"],
    CompClassType: CompetitionClassType.OneRaceIndv,
    ScoreMethod: IndividualScoreMethod.Time
})