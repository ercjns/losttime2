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
    Id: Number;
    Name: string;
    ShortName: string;
}

export type Result = {
    BibNumber: Number;
    ControlCard: Number;
    StartTime: string;
    FinishTime: string;
    Time: Number;
    TimeBehind: Number;
    Status: string;
    Position?: Number;
    SplitTime: SplitTime[];
    AssignedFee?: any;
}

export type SplitTime = {
    ControlCode: Number;
    Time?: Number;
}