import { iofStatusParser } from "../../results/scoremethods/IofStatusParser";
import { LtPerson } from "./LtPerson";
import { LtResult } from "./LtResult";

export type ResultList = {
    ClassResult: ClassResult[];
    Event: Event;
}

export type Event = {
    Name:string;
}

export type ClassResult = {
    Class:Class;
    Course:Course;
    PersonResult:PersonResult[];
}

export type Class = {
    Id: Number;
    Name: string;
    ShortName: string;
    Fee?: any;
}

export type Course = {
    Id: number;
    Name: string;
    Length?: number;
    NumberOfControls?: number;
    Climb?: number;
}

export type PersonResult = {
    Person: Person;
    Organisation: Organisation;
    Result: Result;
}
export type Person = {
    Name: Name;
}

export type Name = {
    Family?: string;
    Given?: string;
}

export type Organisation = {
    Id: number;
    Name: string;
    ShortName: string;
}

export type Result = {
    BibNumber: number;
    ControlCard: number;
    StartTime: string;
    FinishTime: string;
    Time: number;
    TimeBehind: number;
    Status: string;
    Position?: number;
    SplitTime: SplitTime[];
    AssignedFee?: any;
}

export type SplitTime = {
    ControlCode: number;
    Time?: number;
}

export function IofXml3ToLtResult(r:PersonResult):LtResult {
    const person = new LtPerson(r.Person.Name.Given??"", r.Person.Name.Family??"",r.Organisation.ShortName, r.Organisation.Name)

    return new LtResult({
        person: person,
        bib: r.Result.BibNumber?.toString(),
        card: r.Result.ControlCard?.toString(),
        start: r.Result.StartTime?? undefined,
        finish: r.Result.FinishTime?? undefined,
        time: r.Result.Time,
        status: r.Result.Status,
        position: r.Result.Position?? undefined
    })
}