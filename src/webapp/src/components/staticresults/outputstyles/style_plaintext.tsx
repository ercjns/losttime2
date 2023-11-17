import { CompetitionClass } from "../CompetitionClass";

export function createCompClassDocument_plaintext(x:CompetitionClass) {
        if (!x.ScoredCompetitionClass) {
            throw new Error("Not ready to create HTML")
        }
        if (x.ScoredCompetitionClass.Type === "COC_WorldCup") {
            return WorldCupHtml_Indv(x);
        } else if (x.ScoredCompetitionClass.Type === "Time") {
            return TimeHtml_Indv(x);
        }
        
    }

function TimeHtml_Indv(x:CompetitionClass) {
        if (!x.ScoredCompetitionClass?.Results || x.ScoredCompetitionClass.Results.length === 0) {
            throw new Error("Not ready to create HTML")
        }
        let doc = "";
        for (const el of x.ScoredCompetitionClass.Results) {
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
        if (!x.ScoredCompetitionClass?.Results || x.ScoredCompetitionClass.Results.length === 0) {
            throw new Error("Not ready to create HTML")
        }
        let doc = "";
        for (const el of x.ScoredCompetitionClass.Results) {
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