import { getClubNameString } from "../../results/outputstyles/stylehelpers"

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
            this.club = getClubNameString(clubCode) ?? "None"
        } else if (club === clubCode) {
            this.club = getClubNameString(clubCode) ?? club
        } else {
            this.club = club
        }
    }
}