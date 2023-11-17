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
    Family?: String;
    Given?: String;
}

export type Organisation = {
    Id: Number;
    Name: String;
    ShortName: String;
}

export type Result = {
    BibNumber: Number;
    ControlCard: Number;
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