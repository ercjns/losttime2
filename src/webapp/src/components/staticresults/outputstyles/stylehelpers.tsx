import { html_beautify } from 'js-beautify';
import { CodeCheckingStatus, CompetitiveStatus, WorldCupResult } from '../CompetitionClass';

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