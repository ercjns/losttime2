import { getClubNameForClubCode } from "../ClubCodes"

export class LtPerson {
    first: string
    last: string
    club: string
    clubCode: string

    constructor(first: string, last: string, clubCode: string, club?: string) {
        this.first = first
        this.last = last
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
        if (this.first === other.first &&
            this.last === other.last &&
            this.clubCode === other.clubCode
        ) { return true}
        return false
    }
}