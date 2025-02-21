import { Guid } from "guid-typescript";
import { Class, ClassResult, Course, PersonResult } from "../shared/orienteeringtypes/IofResultXml";

interface StandardRaceData {
    id: Guid;
    name: string;
    raceDate?: Date;
}

export class StandardRaceClassData {
    id: Guid;
    race_id: Guid;
    race_name: string;
    xmlClass: Class;
    xmlCourse: Course;
    xmlPersonResults:PersonResult[];

    constructor(race: StandardRaceData, xmlClassResult: ClassResult) {
        this.id = Guid.create();
        this.race_id = race.id;
        this.race_name = race.name
        this.xmlClass = xmlClassResult.Class;
        this.xmlCourse = xmlClassResult.Course;
        // Use [wrap].flat() to ensure there's an array.
        // without this, if only one PersonResult, it's just an object
        // and does not get filled because it's expecting an array.
        this.xmlPersonResults = [xmlClassResult.PersonResult].flat()
    }

}