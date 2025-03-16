import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";

export class Computed_Cascade_SingleSoloPointed extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloPointedResult[]) {
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
                return this.render_html();
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
            (r:SingleRaceSoloPointedResult):string => `${r.place ?? ""}`,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            (r:SingleRaceSoloPointedResult):string => `${r.name} (${r.club})`,
            this.results)
        
        const TIME = new PlaintextColumn(
            "Time",
            (r:SingleRaceSoloPointedResult):string => `${this.timeWithStatusString(r)}`,
            this.results,
            "start")

        const PTS = new PlaintextColumn(
            "Pts",
            (r:SingleRaceSoloPointedResult):string => `${r.points ?? ""}`,
            this.results,
            "start")

        return doc += new PlaintextTable([PL,NAME,TIME,PTS], this.results).tableString
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
            (r:SingleRaceSoloPointedResult):string => `${r.place ?? ""}`
        )
        const NAME = new HtmlColumn(
            "Name",
            (r:SingleRaceSoloPointedResult):string => `${r.name} (${r.club})`
        )
        const TIME = new HtmlColumn(
            "Time",
            (r:SingleRaceSoloPointedResult):string => `${this.timeWithStatusString(r)}`,
            "text-right"
        )
        const PTS = new HtmlColumn(
            "Points",
            (r:SingleRaceSoloPointedResult):string => `${r.points ?? ""}`,
            "text-right"
        )
        const table = new HtmlTable([PL,NAME,TIME,PTS],this).doc
        doc.appendChild(table)
        return this.stringify_html(doc)
    }
}