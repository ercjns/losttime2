import { CompetitionClass } from "../CompetitionClass";
import { Cascade_SingleSoloWorldCup } from "../Variants/Cascade_SingleSoloWorldCup";
import { Standard_Time } from "../Variants/Standard_Time";
import { StandardRaceClassData } from "../../StandardRaceClassData";
import { raceClassesByRace } from "../../Components/Compose/CompetitionClassComposer";
import { CompetitionClassPresetButton } from "./CompetitionClassPresetButton";

type raceClassesByClass = Map<string, (StandardRaceClassData|undefined)[]>

interface CompetitionClassPresetsProps {
    raceClassesByRace: raceClassesByRace
    raceClassesByClass: raceClassesByClass,
    setCompetitionClasses: Function
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

function COC_WIOL2425_Single(raceData:CompetitionClassPresetsProps) {

    let classes:CompetitionClass[] = []

    classes.push(new Standard_Time(
        'Beginner',
        getRaceDataByClassCode(raceData,"1",true)
    ))
    classes.push(new Standard_Time(
        'Advanced Beginner',
        getRaceDataByClassCode(raceData,"3",true)
    ))
    classes.push(new Standard_Time(
        'Intermediate',
        getRaceDataByClassCode(raceData,"5",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Short Advanced Female',
        getRaceDataByClassCode(raceData,"8F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Short Advanced Open',
        getRaceDataByClassCode(raceData,"8O",true)
    ))
    classes.push(new Standard_Time(
        'Short Advanced Groups',
        getRaceDataByClassCode(raceData,"8G",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Long Advanced Female',
        getRaceDataByClassCode(raceData,"9F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Long Advanced Open',
        getRaceDataByClassCode(raceData,"9O",true)
    ))
    classes.push(new Standard_Time(
        'Long Advanced Groups',
        getRaceDataByClassCode(raceData,"9G",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Elementary Female',
        getRaceDataByClassCode(raceData,"W1F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Elementary Male',
        getRaceDataByClassCode(raceData,"W1M",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Middle School Female',
        getRaceDataByClassCode(raceData,"W2F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Middle School Male',
        getRaceDataByClassCode(raceData,"W2M",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School Rookie Female',
        getRaceDataByClassCode(raceData,"W3F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School Rookie Male',
        getRaceDataByClassCode(raceData,"W4M",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School JV Female',
        getRaceDataByClassCode(raceData,"W5F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School JV Male',
        getRaceDataByClassCode(raceData,"W6M",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School Varsity Female',
        getRaceDataByClassCode(raceData,"W7F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'High School Varsity Male',
        getRaceDataByClassCode(raceData,"W7M",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Collegiate JV Female',
        getRaceDataByClassCode(raceData,"WICJVF",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Collegiate JV Male',
        getRaceDataByClassCode(raceData,"WICJVM",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Collegiate Varsity Female',
        getRaceDataByClassCode(raceData,"W9F",true)
    ))
    classes.push(new Cascade_SingleSoloWorldCup(
        'Collegiate Varsity Male',
        getRaceDataByClassCode(raceData,"W9M",true)
    ))

    raceData.setCompetitionClasses((current:CompetitionClass[]) =>
        [...current,...classes])

}


export const presets = [
    new CompetitionClassPresetButton(
        "COC",
        "cascade-WIOL2425-single",
        "2024-25 WIOL: Single Event",
        COC_WIOL2425_Single
    )
    // ,
        
    // {
    //     org: "COC",
    //     id: "cascade-ultimate2025-single",
    //     label: "2025 Ultimate: Single Event",
    //     action: ()=>false
    // },
    // {
    //     org: "COC",
    //     id: "cascade-ultimate2025-series",
    //     label: "2025 Ultimate: Series",
    //     action: ()=>false
    // }
]