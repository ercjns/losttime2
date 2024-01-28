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
    ShortName?: string;
    Fee?: any;
}

export type Course = {
    Id: Number;
    Name: string;
    Length?: Number;
    NumberOfControls?: Number;
    Climb?: Number;
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