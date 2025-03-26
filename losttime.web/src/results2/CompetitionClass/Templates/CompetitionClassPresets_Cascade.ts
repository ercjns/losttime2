import { Cascade_SingleSoloWorldCup } from "../Variants/Cascade_SingleSoloWorldCup";
import { Standard_Time } from "../Variants/Standard_Time";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { raceClassesByRace } from "../../Components/Compose/CompetitionClassComposer";
import { CompetitionClassPresetButton } from "./CompetitionClassPresetButton";
import { Cascade_SingleSoloScottish1k } from "../Variants/Cascade_SingleSoloScottish1k";
import { Cascade_SingleTeamWorldCup } from "../Variants/Cascade_SingleTeamWorldCup";

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
    return raceData.raceClassesByRace.size === 1
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
    new Standard_Time('Beginner', getRaceDataByClassCode(raceData,"Beg",true)),
    new Standard_Time('Intermediate', getRaceDataByClassCode(raceData,"Int",true)),
    new Standard_Time('Short Advancecd', getRaceDataByClassCode(raceData,"Short Adv",true)),
    new Standard_Time('Long Advanced Rec / Groups', getRaceDataByClassCode(raceData,"Long AdvG",true)),
    new Cascade_SingleSoloScottish1k('16 and Under Female', getRaceDataByClassCode(raceData,"16F",true)),
    new Cascade_SingleSoloScottish1k('16 and Under Open', getRaceDataByClassCode(raceData,"16O",true)),
    new Cascade_SingleSoloScottish1k('18 and Under Female', getRaceDataByClassCode(raceData,"18F",true)),
    new Cascade_SingleSoloScottish1k('18 and Under Open', getRaceDataByClassCode(raceData,"18O",true)),
    new Cascade_SingleSoloScottish1k('50+ Female', getRaceDataByClassCode(raceData,"50+F",true)),
    new Cascade_SingleSoloScottish1k('50+ Open', getRaceDataByClassCode(raceData,"50+O",true)),
    new Cascade_SingleSoloScottish1k('70+ Female', getRaceDataByClassCode(raceData,"70+F",true)),
    new Cascade_SingleSoloScottish1k('70+ Open', getRaceDataByClassCode(raceData,"70+O",true)),
    new Cascade_SingleSoloScottish1k('20 and Under Female', getRaceDataByClassCode(raceData,"20F",true)),
    new Cascade_SingleSoloScottish1k('20 and Under Open', getRaceDataByClassCode(raceData,"20O",true)),
    new Cascade_SingleSoloScottish1k('Open (-21+) Female', getRaceDataByClassCode(raceData,"21F",true)),
    new Cascade_SingleSoloScottish1k('Open (-21+)', getRaceDataByClassCode(raceData,"21O",true))
    ])
}

export const presets = [
    new CompetitionClassPresetButton(
        "COC",
        "cascade-WIOL2425-single",
        "2024-25 WIOL: Single Event",
        COC_WIOL2425_Single,
        requireExactlyOneRace
    )
    ,
    new CompetitionClassPresetButton(
        "COC",
        "cascade-UO25-single",
        "2025 Ultimate: Single Event",
        COC_UO25_Single,
        requireExactlyOneRace
    )
]