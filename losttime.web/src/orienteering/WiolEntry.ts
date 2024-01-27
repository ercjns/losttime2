export class WiolEntryCsv {
    "Bib"!: number;
    "SI Card"!: string;
    Rental!: "X" | null;
    "First Name"!: string;
    "Last Name"!: string;
    Gender!: "M" | "F";
    "School Code"!: string;
    Course!: string;
    NC!: "X" | null;
}

export function isWiolEntryCsv(row:any): boolean {
    return (
        Object.keys(row).length === 9 &&
        'Bib' in row &&
        "SI Card" in row &&
        'Rental' in row &&
        "First Name" in row &&
        "Last Name" in row &&
        'Gender' in row &&
        'School Code' in row &&
        'Course' in row &&
        'NC' in row
    )
}