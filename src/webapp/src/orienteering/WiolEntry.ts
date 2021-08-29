export class WiolEntryCsv {
    "Bib #"!: number;
    "SI Card"!: string;
    Rent!: "X" | null;
    "First Name"!: string;
    "Last Name"!: string;
    Gen!: "M" | "F";
    School!: string;
    Course!: string;
    NC!: "X" | null;
}

export function isWiolEntryCsv(row:any): boolean {
    return (
        Object.keys(row).length === 9 &&
        'Bib #' in row &&
        "SI Card" in row &&
        'Rent' in row &&
        "First Name" in row &&
        "Last Name" in row &&
        'Gen' in row &&
        'School' in row &&
        'Course' in row &&
        'NC' in row
    )
}