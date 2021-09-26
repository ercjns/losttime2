export class CascadeRegistrationCsv {
    FirstName!: string;
    LastName!: string;
    Email!: string;
    Club!: string;
    Class!: string;
    Sex!: "F" | "M";
    EPunch!: string;
    Phone!: string;
    EmergencyPhone!: string;
    CarLicense!: string;
    Newcomer!: true | false;
    Group!: number | null;
    Paid!: true | false;
    Owed!: number | null
}

export function isCascadeRegistrationCsv(row:any): boolean {
    if (
        // Object.keys(row).length === 14 &&
        'FirstName' in row &&
        'LastName' in row &&
        'Email' in row &&
        'Club' in row &&
        'Class' in row &&
        'Sex' in row &&
        'EPunch' in row &&
        'Phone' in row &&
        'EmergencyPhone' in row &&
        'CarLicense' in row &&
        'Newcomer' in row &&
        'Group' in row &&
        'Paid' in row &&
        'Owed' in row
    ) {
        return true;
    }
    return false;
}