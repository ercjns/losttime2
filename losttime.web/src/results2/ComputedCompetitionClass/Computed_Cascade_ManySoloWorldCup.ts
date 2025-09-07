import { Guid } from "guid-typescript";
import { ManyRaceSoloResult } from "../CompetitionClass/ManyRaceSoloResult";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { RenderStyles } from "../Styles/RenderStyles";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";


export class Computed_Cascade_ManySoloPointed extends ComputedCompetitionClass {

    results:ManyRaceSoloResult[]

    constructor(competitionClassId:Guid, name:string, r: ManyRaceSoloResult[]) {
        super(competitionClassId, name, r);
        this.results = r
    }
    
    render(style:RenderStyles): string {
        switch (style) {
            case RenderStyles.standard_txt: 
                return this.render_txt();
            case RenderStyles.standard_html: 
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
            ManyRaceSoloResult.getPlace,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            ManyRaceSoloResult.getNameClub,
            this.results)

        const PTS = new PlaintextColumn(
            "Pts",
            ManyRaceSoloResult.getPoints,
            this.results,
            "start")
        
        return doc += new PlaintextTable([PL,NAME,PTS], this.results).tableString;
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
            ()=>"0"
        )
        const PTS = new HtmlColumn(
            "Points",
            ()=>"0",
            "text-right"
        )
        const NAME = new HtmlColumn(
            "Name",
            ()=>"Name"
        )
        const FINISH = new HtmlColumn(
            "Finish",
            ()=>"finish"
        )
        const table = new HtmlTable([PL,PTS,NAME,FINISH],this,[]).doc;
        doc.appendChild(table);
        return this.stringify_html(doc);
    }
};
