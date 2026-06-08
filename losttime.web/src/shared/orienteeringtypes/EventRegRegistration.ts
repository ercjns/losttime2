export class EventRegCsv {
    // Keys here must match the exact key names in the csv file
    // Datatypes here are can only be string, number, or null.
    First!: string;
    Last!: string;
    Status!: string;
    "Bib#"!: number;
    Email!: string;
    CellPhone!: string;
    HomePhone!: string;
    YearBorn!: string;
    Sex!: "F" | "M";
    Club!: string;
    "E-Punch ID": string;
    RentPunch!: "Y" | "N";
    "Event Class": string; //Renamed from custom column "{custom} Class"
    "Event Crs": string; //Renamed from custom column "{custom} Crs"
    "Event Start": string; //Renamed from custom column "{custom} Start"
    "ECName--EmergCont": string;
    "ECphone--EmergCont": string;
    // There are more columns from eventreg but this is all I'm taking for now, and not even all are used.
}

export function isEventRegEntryCsv(row:any): boolean {
    return (
        'First' in row &&
        'Last' in row &&
        'Bib#' in row &&
        "E-Punch ID" in row &&
        'RentPunch' in row &&
        'Sex' in row &&
        'Club' in row &&
        "Event Class" in row &&
        "Event Crs" in row &&
        "Event Start" in row
    )
}