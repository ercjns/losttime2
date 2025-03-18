import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../CompetitionClass/SingleRaceSoloResult";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";


export class Computed_Standard_Time extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloResult[]) {
        super(competitionClassId, name, r);
    }

    render(style:RenderStyles): string {
        switch (style) {
            case RenderStyles.standard_txt: 
                return this.render_txt();
            case RenderStyles.standard_html: 
            case RenderStyles.cascade_wifihtml:
            case RenderStyles.cascade_wordpresshtml:
                return this.render_html();
            default: 
                return this.render_txt();
        }
    }

    render_txt():string {
        let doc = "";
        doc += `${this.name}`
        doc += "\r\n";
        
        if (this.totalFinishers() === 0) {
            doc += `(No participants for this class)\r\n\r\n`
            return doc;
        }
        
        const PL = new PlaintextColumn(
            "Pl",
            (r:SingleRaceSoloResult):string => `${r.place ?? ""}`,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            (r:SingleRaceSoloResult):string => `${r.name} (${r.club})`,
            this.results)
        
        const TIME = new PlaintextColumn(
            "Time",
            (r:SingleRaceSoloResult):string => `${this.timeWithStatusString(r)}`,
            this.results,
            "start")
        
        return doc += new PlaintextTable([PL,NAME,TIME], this.results).tableString;
    }

    render_html():string {
        let doc = document.createElement("div")
        const h2 = document.createElement("h2")
        h2.textContent = `${this.name}`
        h2.setAttribute("id", `competition-class-${this.id.toString()}`)
        doc.appendChild(h2);
        
        if (this.totalFinishers() === 0) {
            const p = document.createElement("p")
            p.textContent = "(No participants for this class)"
            doc.appendChild(p)
            return this.stringify_html(doc)
        }

        const PL = new HtmlColumn(
            "Place", 
            (r:SingleRaceSoloResult):string => `${r.place ?? ""}`
        )
        const NAME = new HtmlColumn(
            "Name",
            (r:SingleRaceSoloResult):string => `${r.name} (${r.club})`
        )
        const TIME = new HtmlColumn(
            "Time",
            (r:SingleRaceSoloResult):string => `${this.timeWithStatusString(r)}`,
            "text-right"
        )
        const table = new HtmlTable([PL,NAME,TIME],this,this.results).doc
        doc.appendChild(table)
        return this.stringify_html(doc)
    }
}