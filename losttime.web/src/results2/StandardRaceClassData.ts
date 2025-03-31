import { Guid } from "guid-typescript";
import { Class, ClassResult, Course, PersonResult } from "../shared/orienteeringtypes/IofResultXml";
import { genericResult, genericScoreResult } from "../shared/orienteeringtypes/LostTimeCsv";
import { LtCourse } from "../shared/orienteeringtypes/LtCourse";
import { LtRaceClass } from "../shared/orienteeringtypes/LtRaceClass";
import { LtResult } from "../shared/orienteeringtypes/LtResult";
import { LtScoreOResult } from "../shared/orienteeringtypes/LtScoreOResult";

interface StandardRaceData {
    id: Guid;
    name: string;
    raceDate?: Date;
}

export class StandardRaceClassData {
    id: Guid;
    race_id: Guid;
    race_name: string;
    course?: LtCourse;
    class: LtRaceClass;
    results: LtResult[]|LtScoreOResult[];

    constructor(race: StandardRaceData, raceClass: LtRaceClass, results: LtResult[], course?: LtCourse ) {
        this.id = Guid.create();
        this.race_id = race.id;
        this.race_name = race.name
        this.class = raceClass
        this.results = results
        this.course = course
    }
}

// export class StandardRaceClassData_XML extends StandardRaceClassData{
//     xmlClass: Class;
//     xmlCourse: Course;
//     xmlPersonResults:PersonResult[];

//     constructor(race: StandardRaceData, xmlClassResult: ClassResult) {
//         super(race)
//         this.xmlClass = xmlClassResult.Class;
//         this.xmlCourse = xmlClassResult.Course;
//         // Use [wrap].flat() to ensure there's an array.
//         // without this, if only one PersonResult, it's just an object
//         // and does not get filled because it's expecting an array.
//         this.xmlPersonResults = [xmlClassResult.PersonResult].flat()
//     }
// }

// export class StandardRaceClassData_CSV extends StandardRaceClassData{
//     csvClass: string
//     csvResults: genericResult[] | genericScoreResult[]

//     constructor(race: StandardRaceData, className: string, data: genericResult[]|genericScoreResult[]) {
//         super(race)
//         this.csvClass = className
//         this.csvResults = data
//     }
// }