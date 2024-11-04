import { getClubNameString, stringify_html, timeWithStatusString} from './stylehelpers';
import { CompetitionClass, ScoredCompetitionClassType } from "../CompetitionClass";
import { WorldCupResult, WorldCupTeamResult } from '../scoremethods/CocWorldCup';
import { CodeCheckingStatus } from '../scoremethods/IofStatusParser';
import { OusaAvgWinTimeResult, OusaAvgWinTimeTeamResult } from '../scoremethods/OusaAwt';

export function createOutputDoc_CascadeOc(data:CompetitionClass[]) {
    const wrap = document.createElement("div");
    wrap.setAttribute("class", "LostTimeContent");
    wrap.setAttribute("id", "lt-top");

    wrap.appendChild(createCompHeader_CascadeOc(data));
    for (const compclass of data) {
        wrap.appendChild(createCompClassOutput_CascadeOc(compclass))
    }
    wrap.appendChild(StatusCodeHelpText());

    return stringify_html(wrap);
}

function createCompHeader_CascadeOc(x:CompetitionClass[]) {
    const head = document.createElement("div");
    head.setAttribute("class", "lg-mrg-bottom");
    head.setAttribute("id", "lt-menu")
    const h2 = document.createElement("h2");
    h2.textContent = "Competition Classes";
    head.appendChild(h2);

    let h4s = x.map(x => {
        const h4 = document.createElement("h4");
        const a = document.createElement("a");
        a.setAttribute("href", "#"+x.ID.toString());
        a.textContent = x.Name;
        h4.appendChild(a);
        return h4;
    })
    h4s.forEach(x => head.appendChild(x));

    return head
}


function createCompClassOutput_CascadeOc(x:CompetitionClass) {
    // TODO:
    // Replace with check for any of Results_<possibleType>
    // if (!x.ScoredCompetitionClass) {
    //     throw new Error("Not ready to create HTML")
    // }


    const wrap = document.createElement("div");
    wrap.setAttribute("class", "classResults lg-mrg-bottom")
    const h3 = document.createElement("h3")
    h3.textContent = x.Name
    h3.setAttribute("id", x.ID.toString())
    wrap.appendChild(h3);

    switch (x.ResultsCreatedType) {
        case ScoredCompetitionClassType.Time:
            wrap.appendChild(TimeHtml_Indv(x));
            break;
        case ScoredCompetitionClassType.CocWorldCup:
            wrap.appendChild(WorldCupHtml_Indv(x));
            break;
        case ScoredCompetitionClassType.CocWorldCupTeams:
            wrap.appendChild(WorldCupHtml_Teams(x));
            break;
        case ScoredCompetitionClassType.OusaAvgWinTime:
            wrap.appendChild(OusaAwtHtml_Indv(x));
            break;
        case ScoredCompetitionClassType.OusaAvgWinTimeTeams:
            wrap.appendChild(OusaAwtHtml_Teams(x));
            break;
        default:
            break;
    }
    const jumpdiv = document.createElement("div");
    const jump = document.createElement("p");
    jump.setAttribute("class", "lg-mrg-bottom text-center");
    const jumplink = document.createElement("a");
    jumplink.setAttribute("href", "#lt-menu");
    jumplink.textContent = "Menu";
    jump.appendChild(jumplink);
    jumpdiv.appendChild(jump);
    wrap.appendChild(jumpdiv);

    return wrap;
}

function TimeHtml_Indv(x:CompetitionClass) {
    if (!x.Results_Time || x.Results_Time.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    table.setAttribute("id", "ResultsTable-"+x.ID.toString())

    const thead = document.createElement("thead");
    const trhead = document.createElement("tr");
    const pos = document.createElement("th");
    pos.textContent = "Pos.";
    trhead.appendChild(pos);
    const name = document.createElement("th");
    name.textContent = "Name";
    trhead.appendChild(name);
    const club = document.createElement("th");
    club.textContent = "Club";
    trhead.appendChild(club);
    const time = document.createElement("th");
    time.textContent = "Time";
    time.setAttribute("class", "text-right");
    trhead.appendChild(time);
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_Time) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupResult)) {throw Error("Not WorldCupResult")}
        const trdata = document.createElement("tr");
        const pos = document.createElement("td");
        pos.textContent = el.Place?.toString() ?? "";
        trdata.appendChild(pos);
        const name = document.createElement("td");
        name.textContent = el.Name;
        trdata.appendChild(name);
        const club = document.createElement("td");
        club.textContent = el.Club ?? "";
        trdata.appendChild(club);
        const time = document.createElement("td");
        time.textContent = timeWithStatusString(el);
        time.setAttribute("class", "text-right");
        trdata.appendChild(time);
        tbody.appendChild(trdata);
    }
    table.appendChild(tbody);
    return table;
}

function OusaAwtHtml_Indv(x:CompetitionClass) {
    if (!x.Results_OusaAvgWinTime || x.Results_OusaAvgWinTime.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    table.setAttribute("id", "ResultsTable-"+x.ID.toString())

    const thead = document.createElement("thead");
    const trhead = document.createElement("tr");
    const pos = document.createElement("th");
    pos.textContent = "Pos.";
    trhead.appendChild(pos);
    const name = document.createElement("th");
    name.textContent = "Name";
    trhead.appendChild(name);
    const club = document.createElement("th");
    club.textContent = "Team";
    trhead.appendChild(club);
    const time = document.createElement("th");
    time.textContent = "Time";
    time.setAttribute("class", "text-right");
    trhead.appendChild(time);
    const score = document.createElement("th");
    score.textContent = "Score";
    score.setAttribute("class", "text-right");
    trhead.appendChild(score);
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_OusaAvgWinTime) {
        if (el === undefined) { continue; }
        if (!(el instanceof OusaAvgWinTimeResult)) {throw Error("Not WorldCupResult")}
        const trdata = document.createElement("tr");
        const pos = document.createElement("td");
        pos.textContent = el.Place?.toString() ?? "";
        trdata.appendChild(pos);
        const name = document.createElement("td");
        name.textContent = el.Name;
        trdata.appendChild(name);
        const club = document.createElement("td");
        club.textContent = el.Club ?? "";
        trdata.appendChild(club);
        const time = document.createElement("td");
        time.textContent = timeWithStatusString(el);
        time.setAttribute("class", "text-right");
        trdata.appendChild(time);
        const score = document.createElement("td");
        score.textContent = el.Points?.toFixed(2) ?? "";
        score.setAttribute("class", "text-right");
        trdata.appendChild(score);
        tbody.appendChild(trdata);
    }
    table.appendChild(tbody);
    return table
}

function OusaAwtHtml_Teams(x:CompetitionClass) {
    if (!x.Results_OusaAvgWinTimeTeams || x.Results_OusaAvgWinTimeTeams.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    table.setAttribute("id", "ResultsTable-"+x.ID.toString())

    const thead = document.createElement("thead");
    const trhead = document.createElement("tr");
    const pos = document.createElement("th");
    pos.textContent = "Pos.";
    trhead.appendChild(pos);
    const score = document.createElement("th");
    score.textContent = "Score";
    trhead.appendChild(score);
    const name = document.createElement("th");
    name.textContent = "Name";
    trhead.appendChild(name);
    const finish = document.createElement("th");
    finish.textContent = "Finish";
    trhead.appendChild(finish);
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_OusaAvgWinTimeTeams) {
        if (el === undefined) { continue; }
        if (!(el instanceof OusaAvgWinTimeTeamResult)) {throw Error("Not OusaAvgWinTimeTeamResult")}
        const trdata = document.createElement("tr");
        trdata.setAttribute("class", "team-result-full");
        const pos = document.createElement("td");
        pos.textContent = el.Place?.toString() ?? "";
        trdata.appendChild(pos);
        const score = document.createElement("td");
        score.textContent = el.Points?.toFixed(2) ?? "";
        trdata.appendChild(score);
        const name = document.createElement("td");
        const teamlong = getClubNameString(el.TeamShortName)
        name.textContent = `${teamlong} (${el.TeamShortName})`
        trdata.appendChild(name);
        const finish = document.createElement("td");
        // finish.textContent = `${el.Contributors.length+el.NonContributors.length} competitors`
        // finish.textContent = getTeamFinishesString(el);
        trdata.appendChild(finish);
        tbody.appendChild(trdata);

        if (el.Contributors.length > 0) {
            for (const member of el.Contributors) {
                const trdata = document.createElement("tr");
                trdata.setAttribute("class", "team-result-member");
                const pos = document.createElement("td");
    
                trdata.appendChild(pos);
                const score = document.createElement("td");
                score.textContent = member.Points?.toFixed(2) ?? "";
                trdata.appendChild(score);
                const name = document.createElement("td");
                name.textContent = `${member.Name} (${member.Club!})`
                trdata.appendChild(name);
                const finish = document.createElement("td");
                finish.textContent = timeWithStatusString(member);
                trdata.appendChild(finish);
                tbody.appendChild(trdata);
            }
        } 
        if (el.NonContributors.length > 0) {
            for (const member of el.NonContributors) {
                const trdata = document.createElement("tr");
                trdata.setAttribute("class", "team-result-member");
                const pos = document.createElement("td");
    
                trdata.appendChild(pos);
                const score = document.createElement("td");
                score.textContent = (member.Points?.toFixed(2) ?? "") + "*"
                trdata.appendChild(score);
                const name = document.createElement("td");
                name.textContent = `${member.Name} (${member.Club!})`
                trdata.appendChild(name);
                const finish = document.createElement("td");
                finish.textContent = timeWithStatusString(member);
                trdata.appendChild(finish);
                tbody.appendChild(trdata);
            }
        }

    }
    table.appendChild(tbody);
    return table;
}

function WorldCupHtml_Indv(x:CompetitionClass) {
    if (!x.Results_WorldCup || x.Results_WorldCup.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    table.setAttribute("id", "ResultsTable-"+x.ID.toString())

    const thead = document.createElement("thead");
    const trhead = document.createElement("tr");
    const pos = document.createElement("th");
    pos.textContent = "Pos.";
    trhead.appendChild(pos);
    const name = document.createElement("th");
    name.textContent = "Name";
    trhead.appendChild(name);
    const club = document.createElement("th");
    club.textContent = "Club";
    trhead.appendChild(club);
    const time = document.createElement("th");
    time.textContent = "Time";
    time.setAttribute("class", "text-right");
    trhead.appendChild(time);
    const score = document.createElement("th");
    score.textContent = "Score";
    score.setAttribute("class", "text-right");
    trhead.appendChild(score);
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_WorldCup) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupResult)) {throw Error("Not WorldCupResult")}
        const trdata = document.createElement("tr");
        const pos = document.createElement("td");
        pos.textContent = el.Place?.toString() ?? "";
        trdata.appendChild(pos);
        const name = document.createElement("td");
        name.textContent = el.Name;
        trdata.appendChild(name);
        const club = document.createElement("td");
        club.textContent = el.Club ?? "";
        trdata.appendChild(club);
        const time = document.createElement("td");
        time.textContent = timeWithStatusString(el);
        time.setAttribute("class", "text-right");
        trdata.appendChild(time);
        const score = document.createElement("td");
        score.textContent = el.Points?.toString() ?? "";
        score.setAttribute("class", "text-right");
        trdata.appendChild(score);
        tbody.appendChild(trdata);
    }
    table.appendChild(tbody);
    return table
}

function WorldCupHtml_Teams(x:CompetitionClass) {
    if (!x.Results_WorldCupTeams || x.Results_WorldCupTeams.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    table.setAttribute("id", "ResultsTable-"+x.ID.toString())

    const thead = document.createElement("thead");
    const trhead = document.createElement("tr");
    const pos = document.createElement("th");
    pos.textContent = "Pos.";
    trhead.appendChild(pos);
    const score = document.createElement("th");
    score.textContent = "Score";
    trhead.appendChild(score);
    const name = document.createElement("th");
    name.textContent = "Name";
    trhead.appendChild(name);
    const finish = document.createElement("th");
    finish.textContent = "Finish";
    trhead.appendChild(finish);
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_WorldCupTeams) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupTeamResult)) {throw Error("Not WorldCupTeamResult")}
        const trdata = document.createElement("tr");
        trdata.setAttribute("class", "team-result-full");
        const pos = document.createElement("td");
        pos.textContent = el.Place!.toString();
        trdata.appendChild(pos);
        const score = document.createElement("td");
        score.textContent = el.Points.toString()
        trdata.appendChild(score);
        const name = document.createElement("td");
        const teamlong = getClubNameString(el.TeamShortName)
        name.textContent = `${teamlong} (${el.TeamShortName})`
        trdata.appendChild(name);
        const finish = document.createElement("td");
        // finish.textContent = `${el.Contributors.length+el.NonContributors.length} competitors`
        finish.textContent = getTeamFinishesString(el);
        trdata.appendChild(finish);
        tbody.appendChild(trdata);

        for (const member of el.Contributors) {
            const trdata = document.createElement("tr");
            trdata.setAttribute("class", "team-result-member");
            const pos = document.createElement("td");

            trdata.appendChild(pos);
            const score = document.createElement("td");
            score.textContent = member.Points!.toString();
            trdata.appendChild(score);
            const name = document.createElement("td");
            name.textContent = `${member.Name} (${member.Club!})`
            trdata.appendChild(name);
            const finish = document.createElement("td");
            finish.textContent = timeWithStatusString(member);
            trdata.appendChild(finish);
            tbody.appendChild(trdata);
        }
    }
    table.appendChild(tbody);
    return table;
}

function StatusCodeHelpText() {
    const codeHelpDiv = document.createElement("div")
    const h3 = document.createElement("h3");
    h3.textContent = "Result Status Codes";
    codeHelpDiv.appendChild(h3);

    const dl = document.createElement("dl");
    dl.setAttribute("class", "dl-horizontal");
    
    const definitions:[string, string][] = [
        ["msp: missing punch", "a control was skipped or taken out of order"],
        ["dnf: did not finish", "a control or set of controls at the end of the course were skipped"],
        ["nc: not competing", "the competitor is not eligible for standings, such as when running a second course"],
        ["dq: disqualified", "breaking competition rules, such as conferring with another competitor or entering an out of bounds area"],
        ["ovt: overtime", "returning after the course closure time"],
        ["dns: did not start", "the competitor did not start"],
        ["<time>*", "the star indicates course completion status was not reported and may be valid, msp, or dnf"]
    ]
    definitions.forEach(([term, def]) => {
        const dt = document.createElement("dt");
        dt.textContent = term;
        dl.appendChild(dt);
        const dd = document.createElement("dd");
        dd.textContent = def;
        dl.appendChild(dd);
    })
    codeHelpDiv.appendChild(dl)
    return codeHelpDiv;
}


function getTeamFinishesString(x:WorldCupTeamResult):string {
    let all = [...x.Contributors, ...x.NonContributors];
    const total = all.length
    const finished = all.filter(x => x.CodeCheckingStatus === CodeCheckingStatus.FIN).length
    const percent = Math.round((finished*100)/total)
    return `${percent}% (${finished} of ${total})`
}