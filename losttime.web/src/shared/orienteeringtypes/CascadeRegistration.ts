export class CascadeRegistrationCsv {
    // Keys here must match the exact key names in the csv file
    // Datatypes here are can only be string, number, or null.
    FirstName!: string;
    LastName!: string;
    Email!: string;
    Club!: string;
    Class!: string;
    Sex!: "F" | "M";
    EPunch!: string;
    Rental!: string;
    Phone!: string;
    EmergencyPhone!: string;
    CarLicense!: string;
    BirthYear!: number | null;
    Newcomer!: string;
    Group!: number | '*' | null;
    Paid!: string;
    Owed!: number | null;
    Waiver!: string;
}

export function isCascadeRegistrationCsv(row:any): boolean | "group" {
    if (
        'FirstName' in row &&
        'LastName' in row &&
        'Email' in row &&
        'Club' in row &&
        'Class' in row &&
        'Sex' in row &&
        'EPunch' in row &&
        'Rental' in row &&
        'Phone' in row &&
        'EmergencyPhone' in row &&
        'CarLicense' in row &&
        'BirthYear' in row &&
        'Newcomer' in row &&
        'Group' in row &&
        'Paid' in row &&
        'Owed' in row &&
        'Waiver' in row
    ) {
        if (row.Group > 1 || row.Group === '*') {
            return "group"
        } 
        return true;
    }
    return false;
}
