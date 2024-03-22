import { getClubNameString, stringify_html, timeWithStatusString, toMMMSS} from './stylehelpers';
import { CompetitionClass, ScoredCompetitionClassType } from "../CompetitionClass";
import { WorldCupMultiResultIndv, WorldCupResult, WorldCupTeamResult } from '../scoremethods/CocWorldCup';
import { CodeCheckingStatus } from '../scoremethods/IofStatusParser';
import { OusaAvgWinTimeResult, OusaAvgWinTimeTeamResult, OusaAvgWinTimeMultiResultIndv} from '../scoremethods/OusaAwt';
import { TeamType } from '../competitionpresets/teamdefinition';

export function createOutputDoc_JN2024(data:CompetitionClass[]) {
    const wrap = createOutputNode_JN2024(data);
    return stringify_html(wrap);
}

export function createOutputNode_JN2024(data:CompetitionClass[]) {
    const wrap = document.createElement("div");
    wrap.setAttribute("class", "block");

    wrap.appendChild(createCompHeader_JN2024(data));
    for (const compclass of data) {
        wrap.appendChild(createCompClassOutput_JN2024(compclass))
    }
    wrap.appendChild(StatusCodeHelpText());
    return wrap;
}

function createCompHeader_JN2024(x:CompetitionClass[]) {
    const head = document.createElement("div");
    head.setAttribute("class", "block");
    head.setAttribute("id", "classes-menu")
    const h2 = document.createElement("h2");
    h2.textContent = "Competition Classes";
    head.appendChild(h2);

    const ul = document.createElement("ul");
    head.appendChild(ul);

    let list = x.map(x => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#"+x.ID.toString());
        a.textContent = x.Name;
        li.appendChild(a);
        return li;
    })
    list.forEach(x => ul.appendChild(x));

    return head
}


function createCompClassOutput_JN2024(x:CompetitionClass) {
    // TODO:
    // Replace with check for any of Results_<possibleType>
    // if (!x.ScoredCompetitionClass) {
    //     throw new Error("Not ready to create HTML")
    // }


    const wrap = document.createElement("div");
    wrap.setAttribute("class", "block")
    const h3 = document.createElement("h3")
    h3.textContent = x.Name
    h3.setAttribute("id", x.ID.toString())
    wrap.appendChild(h3);

    switch (x.ResultsCreatedType) {
        case ScoredCompetitionClassType.Time:
            wrap.appendChild(TimeHtml_Indv(x));
            break;
        // case ScoredCompetitionClassType.CocWorldCup:
        //     wrap.appendChild(WorldCupHtml_Indv(x));
        //     break;
        // case ScoredCompetitionClassType.CocWorldCupTeams:
        //     wrap.appendChild(WorldCupHtml_Teams(x));
        //     break;
        case ScoredCompetitionClassType.OusaAvgWinTime:
            wrap.appendChild(OusaAwtHtml_Indv(x));
            break;
        case ScoredCompetitionClassType.OusaAvgWinTimeTeams:
            wrap.appendChild(OusaAwtHtml_Teams(x));
            break;
        case ScoredCompetitionClassType.Multi_OusaAvgWinTime:
            wrap.appendChild(OusaAwtHtml_Multi_Indv(x));
            break;
        case ScoredCompetitionClassType.Multi_Time:
            wrap.appendChild(TimeHtml_Multi_Indv(x));
            break;
        default:
            break;
    }
    const jumpdiv = document.createElement("div");
    const jump = document.createElement("p");
    jump.setAttribute("class", "has-text-centered");
    const jumplink = document.createElement("a");
    jumplink.setAttribute("href", "#classes-menu");
    jumplink.textContent = "competition classes menu";
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
    table.setAttribute("class", "table is-narrow is-striped");
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
    table.setAttribute("class", "table is-narrow is-striped");
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
    table.setAttribute("class", "table is-narrow is-striped");
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
        trdata.setAttribute("class", "team-result-full is-selected");
        const pos = document.createElement("td");
        pos.textContent = el.Place?.toString() ?? "";
        trdata.appendChild(pos);
        const score = document.createElement("td");
        score.textContent = el.Points?.toFixed(2) ?? "";
        trdata.appendChild(score);
        const name = document.createElement("td");
        // const teamlong = getClubNameString(el.TeamShortName)
        // name.textContent = `${teamlong} (${el.TeamShortName})`
        if (el.TeamInfo) {name.textContent = `${el.TeamName} - ${TeamType[el.TeamInfo.Type]}`;}
        else {name.textContent = el.TeamName;}
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


function OusaAwtHtml_Multi_Indv(x:CompetitionClass) {
    if (!x.Results_Multi_OusaAvgWinTime || x.Results_Multi_OusaAvgWinTime.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table is-narrow is-striped");
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
    
    for (let i=1; i<=x.ScoreMethod_Multi!.ContributingRaces; i++) {
        const raceN = document.createElement("th");
        raceN.textContent = "Race " + i;
        raceN.setAttribute("class", "text-right");
        trhead.appendChild(raceN);
    }

    const total = document.createElement("th");
    total.textContent = "Total";
    total.setAttribute("class", "text-right");
    trhead.appendChild(total);

    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_Multi_OusaAvgWinTime) {
        if (el === undefined) { continue; }
        if (!(el instanceof OusaAvgWinTimeMultiResultIndv)) {throw Error("Not OUSA Multi Result")}
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

        for (let i = 0; i< el.Raw.length; i++) {
            const race = el.Raw[i];
            const raceNscore = document.createElement("td");
            if (race === undefined) {
                trdata.appendChild(raceNscore);
                continue;    
            }
            raceNscore.textContent = race.Points?.toFixed(2) ?? "";
            // raceNscore.textContent += " " + toMMMSS(race.Time)
            if (race.Place === 1) {
                raceNscore.setAttribute("class", "text-right race-place-1")
            }
            else if (race.Place === 2) {
                raceNscore.setAttribute("class", "text-right race-place-2")
            }
            else if (race.Place === 3) {
                raceNscore.setAttribute("class", "text-right race-place-3")
            } else {
                raceNscore.setAttribute("class", "text-right");
            }
            trdata.appendChild(raceNscore);
        }

        const score = document.createElement("td");
        score.textContent = el.Points?.toFixed(2) ?? "";
        score.setAttribute("class", "text-right total-score");
        trdata.appendChild(score);
        tbody.appendChild(trdata);
    }
    table.appendChild(tbody);
    return table
}

function TimeHtml_Multi_Indv(x:CompetitionClass) {
    if (!x.Results_Multi_Time || x.Results_Multi_Time.length === 0) {
        const emptydiv = document.createElement("div");
        emptydiv.textContent ="No results for this class";
        return emptydiv;
    }

    const table = document.createElement("table");
    table.setAttribute("class", "table is-narrow is-striped");
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
    
    for (let i=1; i<=x.ScoreMethod_Multi!.ContributingRaces; i++) {
        const raceN = document.createElement("th");
        raceN.textContent = "Race " + i;
        raceN.setAttribute("class", "text-right");
        trhead.appendChild(raceN);
    }

    const total = document.createElement("th");
    total.textContent = "Total";
    total.setAttribute("class", "text-right");
    trhead.appendChild(total);

    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody")

    for (const el of x.Results_Multi_Time) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupMultiResultIndv)) {throw Error("Not OUSA Multi Result")}
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

        for (let i = 0; i< el.Raw.length; i++) {
            const race = el.Raw[i];
            const raceNscore = document.createElement("td");
            if (race === undefined) {
                trdata.appendChild(raceNscore);
                continue;    
            }
            // raceNscore.textContent = timeWithStatusString(race) ?? "";
            raceNscore.textContent = toMMMSS(race.Points);

            if (race.Place === 1) {
                raceNscore.setAttribute("class", "text-right race-place-1")
            }
            else if (race.Place === 2) {
                raceNscore.setAttribute("class", "text-right race-place-2")
            }
            else if (race.Place === 3) {
                raceNscore.setAttribute("class", "text-right race-place-3")
            } else {
                raceNscore.setAttribute("class", "text-right");
            }
            trdata.appendChild(raceNscore);
        }

        const score = document.createElement("td");
        score.textContent = toMMMSS(el.Points);
        score.setAttribute("class", "text-right total-score");
        trdata.appendChild(score);
        tbody.appendChild(trdata);
    }
    table.appendChild(tbody);
    return table
}


function StatusCodeHelpText() {
    const codeHelpDiv = document.createElement("div")
    const h3 = document.createElement("h3");
    h3.textContent = "Result Status Codes";
    codeHelpDiv.appendChild(h3);

    const dl = document.createElement("dl");
    dl.setAttribute("class", "dl-horizontal");
    
    const definitions:[string, string][] = [
        ["MSP: missing punch", "a control was skipped or taken out of order"],
        ["DNF: did not finish", "a control or set of controls at the end of the course were skipped"],
        ["NC: not competing", "the competitor is not eligible for standings, such as when running a second course"],
        ["DQ: disqualified", "breaking competition rules, such as conferring with another competitor or entering an out of bounds area"],
        ["OVT: overtime", "returning after the course closure time"],
        ["DNS: did not start", "the competitor did not start"],
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