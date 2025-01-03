import { html_beautify } from 'js-beautify';
import _ClubCodes from '../competitionpresets/ClubCodes.json'
import { CodeCheckingStatus, CompetitiveStatus } from '../scoremethods/IofStatusParser';
import { WorldCupResult } from '../scoremethods/CocWorldCup';
import { TeamType } from '../competitionpresets/teamdefinition';
import { CompetitionClass } from '../CompetitionClass';
const ClubCodes = _ClubCodes as ClubCodeLookup[]

export function stringify_html(html:HTMLDivElement) {
    const wrap = document.createElement("div");
    wrap.appendChild(html);
    return html_beautify(wrap.innerHTML);
}

export function toMMMSS(time:number|undefined) {
    if (time === undefined) {return "--:--"}
    const mins = Math.floor(time / 60)
    const secs = time % 60;
    return mins.toString() + ":" + secs.toString().padStart(2, "0");
}

export function timeWithStatusString(x:WorldCupResult) {
    if (x.CodeCheckingStatus === CodeCheckingStatus.FIN &&
         x.CompetitiveStatus === CompetitiveStatus.COMP) {
            return toMMMSS(x.Time)
         }
    else if (x.CodeCheckingStatus !== CodeCheckingStatus.UNK) {
        return `${CodeCheckingStatus[x.CodeCheckingStatus]} ${toMMMSS(x.Time)}`
    } else {
        return `${CompetitiveStatus[x.CompetitiveStatus]} ${toMMMSS(x.Time)}*`
    }
}

type ClubCodeLookup = {
    Namespace: string
    Code: string
    Name: string
}

export function getClubNameString(clubcode:string, checkAllNamespaces:boolean=true, preferredNamspace:string|null=null) {
    if (clubcode.trim().length === 0) {return "None"}
    const clubs1:ClubCodeLookup[] = []
    const clubs2:ClubCodeLookup[] = []
    if (preferredNamspace !== null) {
        clubs1.push(...ClubCodes.filter(x => x.Namespace === preferredNamspace))
        if (checkAllNamespaces) {
            clubs2.push(...ClubCodes.filter(x => x.Namespace !== preferredNamspace))
        }
    } else {
        clubs1.push(...ClubCodes)
    }

    let res = clubs1.find(x => x.Code === clubcode)
    if (res !== undefined) {return res.Name}
    res = clubs2.find(x => x.Code === clubcode)
    return res ? res.Name : clubcode
}

export function getTotalIndividualsCount(data:CompetitionClass[]):number {
    // TODO: there are cases where this doesn't quite work as it's more contextual
    // based on the exact scoring setup for any given event / suite of classes.
    const total = 0;
    const sumFinishers = data.reduce(
        (acc, cur) => acc + (cur.IsTeamClass ? 0 : cur.totalParticipants(false)),
        total)
    return sumFinishers
}