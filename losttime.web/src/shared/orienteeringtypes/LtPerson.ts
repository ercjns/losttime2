import { getClubNameForClubCode } from "../ClubCodes"

export class LtPerson {
    first: string
    last: string
    club: string
    clubCode: string

    constructor(first: string, last: string, clubCode: string, club?: string) {
        this.first = toTitleCaseHelper(first)
        this.last = toTitleCaseHelper(last)
        this.clubCode = clubCode
        if (club === undefined) {
            this.club = getClubNameForClubCode(clubCode) ?? "None"
        } else if (club === clubCode) {
            this.club = getClubNameForClubCode(clubCode) ?? club
        } else {
            this.club = club
        }
    }

    sameNameAndClubCode = (other:LtPerson):boolean => {
        if (this.first.toLocaleLowerCase() === other.first.toLocaleLowerCase() &&
            this.last.toLocaleLowerCase() === other.last.toLocaleLowerCase() &&
            this.clubCode.toLocaleUpperCase() === other.clubCode.toLocaleUpperCase()
        ) { return true}
        return false
    }
}

function toTitleCaseHelper(input:string):string {
    // This function specifically does the following ONLY:
    // If input is all "CAPS", change to proper case "Caps"
    // If input is all "lower", change to proper case "Lower"
    if (input.length < 2) {
        return input
    }
    if (input.toLocaleUpperCase() === input || input.toLocaleLowerCase() === input) {
        return input.charAt(0).toLocaleUpperCase()+input.slice(1).toLocaleLowerCase()
    } else {
        return input
    }
}