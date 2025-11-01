import _ClubCodes from './ClubCodes.json'

type ClubCodeLookup = {
    Namespace: string
    Code: string
    Name: string
}

const CLUB_CODES = _ClubCodes as ClubCodeLookup[]

export function getClubNameForClubCode(clubcode:string, checkAllNamespaces:boolean=true, preferredNamspace:string|null=null) {
    if (clubcode.trim().length === 0) {return "None"}
    const clubs1:ClubCodeLookup[] = []
    const clubs2:ClubCodeLookup[] = []
    if (preferredNamspace !== null) {
        clubs1.push(...CLUB_CODES.filter(x => x.Namespace === preferredNamspace))
        if (checkAllNamespaces) {
            clubs2.push(...CLUB_CODES.filter(x => x.Namespace !== preferredNamspace))
        }
    } else {
        clubs1.push(...CLUB_CODES)
    }

    let res = clubs1.find(x => x.Code === clubcode)
    if (res !== undefined) {return res.Name}
    res = clubs2.find(x => x.Code === clubcode)
    return res ? res.Name : clubcode
}