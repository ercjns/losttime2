import { Cascade_SingleSoloWorldCup } from "../Variants/Cascade_SingleSoloWorldCup";
import { Standard_Time } from "../Variants/Standard_Time";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { raceClassesByRace } from "../../Components/Compose/CompetitionClassComposer";
import { CompetitionClassPresetButton } from "./CompetitionClassPresetButton";
import { Cascade_SingleSoloScottish1k } from "../Variants/Cascade_SingleSoloScottish1k";
import { Cascade_SingleTeamWorldCup } from "../Variants/Cascade_SingleTeamWorldCup";
import { Cascade_SingleSoloScoreOScottish1k } from "../Variants/Cascade_SingleSoloScoreOScottish1k";
import { Standard_ScoreO } from "../Variants/Standard_ScoreO";
import { Cascade_ManySoloWorldCup } from "../Variants/Cascade_ManySoloWorldCup";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass
    setCompetitionClasses: Function
}

function getRaceDataByClassCodes(raceData:CompetitionClassPresetsProps, codes:string[], firstRaceOnly=false):StandardRaceClassData[] {
    let result:StandardRaceClassData[] = []
    codes.forEach((code) => {
        result.push(...getRaceDataByClassCode(raceData, code, firstRaceOnly))
    })
    return result
}

function getRaceDataByClassCode(raceData:CompetitionClassPresetsProps, code:string, firstRaceOnly=false):StandardRaceClassData[] {
    const classData = raceData.raceClassesByClass.get(code)
    if (classData === undefined) {return []}
    
    if (firstRaceOnly) {
        if (classData[0] === undefined) {return []}
        else {return [classData[0]]}
    } else {
        let validClassData:StandardRaceClassData[] = []
        classData.forEach((x) => {
            if (x !== undefined) {validClassData.push(x)}
        })
        return validClassData
    }
}

function requireExactlyOneRace(raceData:CompetitionClassPresetsProps):boolean {
    return raceData.raceClassesByRace.size === 1;
}

function requireAtLeastTwoRaces(raceData:CompetitionClassPresetsProps):boolean {
    return raceData.raceClassesByRace.size > 1;
}

function COC_WIOL2425_Single(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Standard_Time('Beginner', getRaceDataByClassCode(raceData,"1",true)),
    new Standard_Time('Advanced Beginner', getRaceDataByClassCode(raceData,"3",true)),
    new Standard_Time('Intermediate', getRaceDataByClassCode(raceData,"5",true)),
    new Cascade_SingleSoloWorldCup('Short Advanced Female', getRaceDataByClassCode(raceData,"8F",true)),
    new Cascade_SingleSoloWorldCup('Short Advanced Open', getRaceDataByClassCode(raceData,"8O",true)),
    new Standard_Time('Short Advanced Groups', getRaceDataByClassCode(raceData,"8G",true)),
    new Cascade_SingleSoloWorldCup('Long Advanced Female', getRaceDataByClassCode(raceData,"9F",true)),
    new Cascade_SingleSoloWorldCup('Long Advanced Open', getRaceDataByClassCode(raceData,"9O",true)),
    new Standard_Time('Long Advanced Groups', getRaceDataByClassCode(raceData,"9G",true)),
    new Cascade_SingleSoloWorldCup('Elementary Female', getRaceDataByClassCode(raceData,"W1F",true)),
    new Cascade_SingleSoloWorldCup('Elementary Male', getRaceDataByClassCode(raceData,"W1M",true)),
    new Cascade_SingleTeamWorldCup('Elementary Teams', getRaceDataByClassCodes(raceData,["W1F","W1M"],true)),
    new Cascade_SingleSoloWorldCup('Middle School Female', getRaceDataByClassCode(raceData,"W2F",true)),
    new Cascade_SingleSoloWorldCup('Middle School Male', getRaceDataByClassCode(raceData,"W2M",true)),
    new Cascade_SingleTeamWorldCup('Middle School Teams', getRaceDataByClassCodes(raceData,["W2F","W2M"],true)),
    new Cascade_SingleSoloWorldCup('High School Rookie Female', getRaceDataByClassCode(raceData,"W3F",true)),
    new Cascade_SingleSoloWorldCup('High School Rookie Male', getRaceDataByClassCode(raceData,"W4M",true)),
    new Cascade_SingleTeamWorldCup('High School Rookie Teams', getRaceDataByClassCodes(raceData,["W3F","W4M"],true)),
    new Cascade_SingleSoloWorldCup('High School JV Female', getRaceDataByClassCode(raceData,"W5F",true)),
    new Cascade_SingleTeamWorldCup('High School JV Female Teams', getRaceDataByClassCode(raceData,"W5F",true)),
    new Cascade_SingleSoloWorldCup('High School JV Male', getRaceDataByClassCode(raceData,"W6M",true)),
    new Cascade_SingleTeamWorldCup('High School JV Male Teams', getRaceDataByClassCode(raceData,"W6M",true)),
    new Cascade_SingleSoloWorldCup('High School Varsity Female', getRaceDataByClassCode(raceData,"W7F",true)),
    new Cascade_SingleSoloWorldCup('High School Varsity Male', getRaceDataByClassCode(raceData,"W7M",true)),
    new Cascade_SingleTeamWorldCup('High School Varsity Teams', getRaceDataByClassCodes(raceData,["W7F","W7M"],true)),
    new Cascade_SingleSoloWorldCup('Collegiate JV Female', getRaceDataByClassCode(raceData,"WICJVF",true)),
    new Cascade_SingleSoloWorldCup('Collegiate JV Male', getRaceDataByClassCode(raceData,"WICJVM",true)),
    new Cascade_SingleSoloWorldCup('Collegiate Varsity Female', getRaceDataByClassCode(raceData,"W9F",true)),
    new Cascade_SingleSoloWorldCup('Collegiate Varsity Male', getRaceDataByClassCode(raceData,"W9M",true)),
    new Cascade_SingleTeamWorldCup('Collegiate Varsity Teams', getRaceDataByClassCodes(raceData,["W9F","W9M"],true))
    ])
}

function COC_UO25_Single(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Standard_Time('Beginner', getRaceDataByClassCode(raceData,"1",true)),
    new Standard_Time('Intermediate', getRaceDataByClassCode(raceData,"2",true)),
    new Standard_Time('Short Advancecd', getRaceDataByClassCode(raceData,"3",true)),
    new Standard_Time('Long Advanced Rec / Groups', getRaceDataByClassCode(raceData,"4G",true)),
    new Cascade_SingleSoloScottish1k('16 and Under Female', getRaceDataByClassCode(raceData,"F-16",true)),
    new Cascade_SingleSoloScottish1k('16 and Under Open', getRaceDataByClassCode(raceData,"O-16",true)),
    new Cascade_SingleSoloScottish1k('18 and Under Female', getRaceDataByClassCode(raceData,"F-18",true)),
    new Cascade_SingleSoloScottish1k('18 and Under Open', getRaceDataByClassCode(raceData,"O-18",true)),
    new Cascade_SingleSoloScottish1k('50+ Female', getRaceDataByClassCode(raceData,"F50+",true)),
    new Cascade_SingleSoloScottish1k('50+ Open', getRaceDataByClassCode(raceData,"O50+",true)),
    new Cascade_SingleSoloScottish1k('70+ Female', getRaceDataByClassCode(raceData,"F70+",true)),
    new Cascade_SingleSoloScottish1k('70+ Open', getRaceDataByClassCode(raceData,"O70+",true)),
    new Cascade_SingleSoloScottish1k('20 and Under Female', getRaceDataByClassCode(raceData,"F-20",true)),
    new Cascade_SingleSoloScottish1k('20 and Under Open', getRaceDataByClassCode(raceData,"O-20",true)),
    new Cascade_SingleSoloScottish1k('Open (-21+) Female', getRaceDataByClassCode(raceData,"F-21+",true)),
    new Cascade_SingleSoloScottish1k('Open (-21+)', getRaceDataByClassCode(raceData,"O-21+",true))
    ])
}

function COC_UO25_SingleScoreO(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Standard_ScoreO('Beginner', getRaceDataByClassCode(raceData,"1",true)),
    new Standard_ScoreO('Intermediate', getRaceDataByClassCode(raceData,"2",true)),
    new Standard_ScoreO('Short Advancecd', getRaceDataByClassCode(raceData,"3",true)),
    new Standard_ScoreO('Long Advanced Rec / Groups', getRaceDataByClassCode(raceData,"4",true)),
    new Cascade_SingleSoloScoreOScottish1k('16 and Under Female', getRaceDataByClassCode(raceData,"F-16",true)),
    new Cascade_SingleSoloScoreOScottish1k('16 and Under Open', getRaceDataByClassCode(raceData,"O-16",true)),
    new Cascade_SingleSoloScoreOScottish1k('18 and Under Female', getRaceDataByClassCode(raceData,"F-18",true)),
    new Cascade_SingleSoloScoreOScottish1k('18 and Under Open', getRaceDataByClassCode(raceData,"O-18",true)),
    new Cascade_SingleSoloScoreOScottish1k('50+ Female', getRaceDataByClassCode(raceData,"F50+",true)),
    new Cascade_SingleSoloScoreOScottish1k('50+ Open', getRaceDataByClassCode(raceData,"O50+",true)),
    new Cascade_SingleSoloScoreOScottish1k('70+ Female', getRaceDataByClassCode(raceData,"F70+",true)),
    new Cascade_SingleSoloScoreOScottish1k('70+ Open', getRaceDataByClassCode(raceData,"O70+",true)),
    new Cascade_SingleSoloScoreOScottish1k('20 and Under Female', getRaceDataByClassCode(raceData,"F-20",true)),
    new Cascade_SingleSoloScoreOScottish1k('20 and Under Open', getRaceDataByClassCode(raceData,"O-20",true)),
    new Cascade_SingleSoloScoreOScottish1k('Open (-21+) Female', getRaceDataByClassCode(raceData,"F-21+",true)),
    new Cascade_SingleSoloScoreOScottish1k('Open (-21+)', getRaceDataByClassCode(raceData,"O-21+",true))
    ])
}

function COC_WL2526_Single(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Standard_Time('Beginner', getRaceDataByClassCode(raceData,"1",true)),
    new Standard_Time('Advanced Beginner', getRaceDataByClassCode(raceData,"3",true)),
    new Standard_Time('Intermediate', getRaceDataByClassCode(raceData,"5",true)),
    new Standard_Time('Short Advanced Groups', getRaceDataByClassCode(raceData,"8G",true)),
    new Cascade_SingleSoloWorldCup('Short Advanced Female', getRaceDataByClassCode(raceData,"8F",true)),
    new Cascade_SingleSoloWorldCup('Short Advanced Open', getRaceDataByClassCode(raceData,"8O",true)),
    new Standard_Time('Long Advanced Groups', getRaceDataByClassCode(raceData,"9G",true)),
    new Cascade_SingleSoloWorldCup('Long Advanced Female', getRaceDataByClassCode(raceData,"9F",true)),
    new Cascade_SingleSoloWorldCup('Long Advanced Open', getRaceDataByClassCode(raceData,"9O",true)),
    new Cascade_SingleSoloWorldCup('Elementary Female', getRaceDataByClassCode(raceData,"W1F",true)),
    new Cascade_SingleSoloWorldCup('Elementary Male', getRaceDataByClassCode(raceData,"W1M",true)),
    new Cascade_SingleTeamWorldCup('Elementary Teams', getRaceDataByClassCodes(raceData,["W1F","W1M"],true)),
    new Cascade_SingleSoloWorldCup('Middle School Female', getRaceDataByClassCode(raceData,"W2F",true)),
    new Cascade_SingleSoloWorldCup('Middle School Male', getRaceDataByClassCode(raceData,"W2M",true)),
    new Cascade_SingleTeamWorldCup('Middle School Teams', getRaceDataByClassCodes(raceData,["W2F","W2M"],true)),
    new Cascade_SingleSoloWorldCup('High School Rookie Female', getRaceDataByClassCode(raceData,"W3F",true)),
    new Cascade_SingleSoloWorldCup('High School Rookie Male', getRaceDataByClassCode(raceData,"W4M",true)),
    new Cascade_SingleTeamWorldCup('High School Rookie Teams', getRaceDataByClassCodes(raceData,["W3F","W4M"],true)),
    new Cascade_SingleSoloWorldCup('High School JV Female', getRaceDataByClassCode(raceData,"W5F",true)),
    new Cascade_SingleTeamWorldCup('High School JV Female Teams', getRaceDataByClassCode(raceData,"W5F",true)),
    new Cascade_SingleSoloWorldCup('High School JV Male', getRaceDataByClassCode(raceData,"W6M",true)),
    new Cascade_SingleTeamWorldCup('High School JV Male Teams', getRaceDataByClassCode(raceData,"W6M",true)),
    new Cascade_SingleSoloWorldCup('High School Varsity Female', getRaceDataByClassCode(raceData,"W7F",true)),
    new Cascade_SingleSoloWorldCup('High School Varsity Male', getRaceDataByClassCode(raceData,"W7M",true)),
    new Cascade_SingleTeamWorldCup('High School Varsity Teams', getRaceDataByClassCodes(raceData,["W7F","W7M"],true)),
    new Cascade_SingleSoloWorldCup('Collegiate JV Female', getRaceDataByClassCode(raceData,"WICJVF",true)),
    new Cascade_SingleSoloWorldCup('Collegiate JV Male', getRaceDataByClassCode(raceData,"WICJVM",true)),
    new Cascade_SingleSoloWorldCup('Collegiate Varsity Female', getRaceDataByClassCode(raceData,"W9F",true)),
    new Cascade_SingleSoloWorldCup('Collegiate Varsity Male', getRaceDataByClassCode(raceData,"W9M",true)),
    new Cascade_SingleTeamWorldCup('Collegiate Varsity Teams', getRaceDataByClassCodes(raceData,["W9F","W9M"],true))
    ])
}
function COC_WL2526_PublicSeries(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Cascade_ManySoloWorldCup('Short Advanced Female', getRaceDataByClassCode(raceData,"8F")),
    new Cascade_ManySoloWorldCup('Short Advanced Open', getRaceDataByClassCode(raceData,"8O")),
    new Cascade_ManySoloWorldCup('Long Advanced Female', getRaceDataByClassCode(raceData,"9F")),
    new Cascade_ManySoloWorldCup('Long Advanced Open', getRaceDataByClassCode(raceData,"9O")),
    ])
}
function COC_WL2526_WiolSeries(raceData:CompetitionClassPresetsProps) {
    raceData.setCompetitionClasses([
    new Cascade_ManySoloWorldCup('Elementary Female', getRaceDataByClassCode(raceData,"W1F")),
    new Cascade_ManySoloWorldCup('Elementary Male', getRaceDataByClassCode(raceData,"W1M")),
    // new Cascade_SingleTeamWorldCup('Elementary Teams', getRaceDataByClassCodes(raceData,["W1F","W1M"],true)),
    new Cascade_ManySoloWorldCup('Middle School Female', getRaceDataByClassCode(raceData,"W2F")),
    new Cascade_ManySoloWorldCup('Middle School Male', getRaceDataByClassCode(raceData,"W2M")),
    // new Cascade_SingleTeamWorldCup('Middle School Teams', getRaceDataByClassCodes(raceData,["W2F","W2M"],true)),
    new Cascade_ManySoloWorldCup('High School Rookie Female', getRaceDataByClassCode(raceData,"W3F")),
    new Cascade_ManySoloWorldCup('High School Rookie Male', getRaceDataByClassCode(raceData,"W4M")),
    // new Cascade_SingleTeamWorldCup('High School Rookie Teams', getRaceDataByClassCodes(raceData,["W3F","W4M"],true)),
    new Cascade_ManySoloWorldCup('High School JV Female', getRaceDataByClassCode(raceData,"W5F")),
    // new Cascade_SingleTeamWorldCup('High School JV Female Teams', getRaceDataByClassCode(raceData,"W5F",true)),
    new Cascade_ManySoloWorldCup('High School JV Male', getRaceDataByClassCode(raceData,"W6M")),
    // new Cascade_SingleTeamWorldCup('High School JV Male Teams', getRaceDataByClassCode(raceData,"W6M",true)),
    new Cascade_ManySoloWorldCup('High School Varsity Female', getRaceDataByClassCode(raceData,"W7F")),
    new Cascade_ManySoloWorldCup('High School Varsity Male', getRaceDataByClassCode(raceData,"W7M")),
    // new Cascade_SingleTeamWorldCup('High School Varsity Teams', getRaceDataByClassCodes(raceData,["W7F","W7M"],true)),
    new Cascade_ManySoloWorldCup('Collegiate Varsity Female', getRaceDataByClassCode(raceData,"W9F")),
    new Cascade_ManySoloWorldCup('Collegiate Varsity Male', getRaceDataByClassCode(raceData,"W9M")),
    // new Cascade_SingleTeamWorldCup('Collegiate Varsity Teams', getRaceDataByClassCodes(raceData,["W9F","W9M"],true))
    ])
}

export const presets = [
    new CompetitionClassPresetButton(
        "COC",
        "cascade-UO25-single",
        "2025 Ultimate: Single Event",
        COC_UO25_Single,
        requireExactlyOneRace
    ),
    new CompetitionClassPresetButton(
        "COC",
        "cascade-UO25-singleScoreO",
        "2025 Ultimate: Single ScoreO Event",
        COC_UO25_SingleScoreO,
        requireExactlyOneRace
    ),
    new CompetitionClassPresetButton(
        "COC",
        "cascade-WIOL2425-single",
        "2024-25 WIOL: Single Event",
        COC_WIOL2425_Single,
        requireExactlyOneRace
    ),
    new CompetitionClassPresetButton(
        "COC",
        "cascade-WL2526-single",
        "2025-26 Winter: Single Event",
        COC_WL2526_Single,
        requireExactlyOneRace
    ),
        new CompetitionClassPresetButton(
        "COC",
        "cascade-WL2526-series-public",
        "2025-26 Winter: Public Series",
        COC_WL2526_PublicSeries,
        requireAtLeastTwoRaces
    ),
        new CompetitionClassPresetButton(
        "COC",
        "cascade-WL2526-series-wiol",
        "2025-26 Winter: WIOL Series",
        COC_WL2526_WiolSeries,
        requireAtLeastTwoRaces
    )
]