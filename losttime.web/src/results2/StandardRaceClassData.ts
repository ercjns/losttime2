import { Guid } from "guid-typescript";
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