import { CompetitionClass, ScoredCompetitionClassType } from "../CompetitionClass";

export function createCompClassDocument_plaintext(x:CompetitionClass) {
    if (x.ResultsCreatedType === ScoredCompetitionClassType.CocWorldCup) {
        return WorldCupHtml_Indv(x);
    } else if (x.ResultsCreatedType === ScoredCompetitionClassType.Time) {
        return TimeHtml_Indv(x);
    } else {
        throw new Error("Not ready to create HTML")
    }
    
}

function TimeHtml_Indv(x:CompetitionClass) {
    if (!x.Results_Time || x.Results_Time.length === 0) {
            throw new Error("Not ready to create HTML")
    }
    let doc = "";
    for (const el of x.Results_Time) {
        if (el === undefined) { continue; }
        doc += "Check:"
        doc += el.CodeCheckingStatus;
        doc += " Comp:"
        doc += el.CompetitiveStatus;
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
    if (!x.Results_WorldCup || x.Results_WorldCup.length === 0) {
        throw new Error("Not ready to create HTML")
    }
    let doc = "";
    for (const el of x.Results_WorldCup) {
        if (el === undefined) { continue; }
        doc += "Check:"
        doc += el.CodeCheckingStatus;
        doc += " Comp:"
        doc += el.CompetitiveStatus;
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