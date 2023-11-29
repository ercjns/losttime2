import { stringify_html } from './stylehelpers';
import { CodeCheckingStatus, CompetitionClass, CompetitiveStatus, ScoredCompetitionClassType, WorldCupResult, WorldCupTeamResult } from "../CompetitionClass";

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
    if (!x.ScoredCompetitionClass) {
        throw new Error("Not ready to create HTML")
    }

    const wrap = document.createElement("div");
    wrap.setAttribute("class", "classResults lg-mrg-bottom")
    const h3 = document.createElement("h3")
    h3.textContent = x.Name
    h3.setAttribute("id", x.ID.toString())
    wrap.appendChild(h3);
    const data = document.createElement("table")
    
    // convert this to a swtich/case
    // have some way to fall back to plaintext if not implemented specifically?
    if (x.ScoredCompetitionClass.Type === ScoredCompetitionClassType.CocWorldCup) {
        data.textContent = WorldCupHtml_Indv(x);
    } else if (x.ScoredCompetitionClass.Type === ScoredCompetitionClassType.CocWorldCupTeams) {
        data.textContent = WorldCupHtml_Teams(x); //TODO NEW TEAM HTML
    } else if (x.ScoredCompetitionClass.Type === ScoredCompetitionClassType.Time) {
        data.textContent = TimeHtml_Indv(x);
    }

    wrap.appendChild(data);
    return wrap;
}

function TimeHtml_Indv(x:CompetitionClass) {
    if (!x.ScoredCompetitionClass?.Results || x.ScoredCompetitionClass.Results.length === 0) {
        return "No results for this class";
    }
    let doc = "";
    for (const el of x.ScoredCompetitionClass.Results) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupResult)) {throw Error("Not WorldCupResult")}
        doc += "Check:"
        doc += CodeCheckingStatus[el.CodeCheckingStatus];
        doc += " Comp:"
        doc += CompetitiveStatus[el.CompetitiveStatus];
        doc += " Time:"
        doc += el.Time ?? " ";
        doc += " Place:"
        doc += el.Place ?? " ";
        doc += " Name:";
        doc += el.Name;
        doc += "\r\n";
    }
    return doc;
}

function WorldCupHtml_Indv(x:CompetitionClass) {
    if (!x.ScoredCompetitionClass?.Results || x.ScoredCompetitionClass.Results.length === 0) {
        return "No results for this class";
    }

    let doc = "";
    for (const el of x.ScoredCompetitionClass.Results) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupResult)) {throw Error("Not WorldCupResult")}
        // TODO: replace with proper html for results table
        doc += "Check:"
        doc += CodeCheckingStatus[el.CodeCheckingStatus];
        doc += " Comp:"
        doc += CompetitiveStatus[el.CompetitiveStatus];
        doc += " Time:"
        doc += el.Time ?? " ";
        doc += " Place:"
        doc += el.Place ?? " ";
        doc += " Name:";
        doc += el.Name;
        doc += " Points:";
        doc += el.Points ?? ""
        doc += "\r\n";
    }
    return doc;
}

function WorldCupHtml_Teams(x:CompetitionClass) {
    if (!x.ScoredCompetitionClass?.Results || x.ScoredCompetitionClass.Results.length === 0) {
        return "No results for this class";
    }

    let doc = "";
    for (const el of x.ScoredCompetitionClass.Results) {
        if (el === undefined) { continue; }
        if (!(el instanceof WorldCupTeamResult)) {throw Error("Not WorldCupTeamResult")}
        doc += "Place: " + el.Place ?? ""
        doc += "Team: " + el.TeamName
        doc += "Members: " + (el.Contributors.length + el.NonContributors.length)
        doc += "Points: " + el.Points
        doc += "\r\n"
        for (const tm of el.Contributors) {
            doc += " Time:"
            doc += tm.Time ?? " ";
            doc += " Name:";
            doc += tm.Name;
            doc += " Points:";
            doc += tm.Points ?? ""
            doc += "\r\n"
        }
    }
    return doc;
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
    definitions.map(([term, def]) => {
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
