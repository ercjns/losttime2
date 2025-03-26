import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";

export class Computed_Cascade_SingleSoloPointed extends ComputedCompetitionClass {

    results: SingleRaceSoloPointedResult[]

    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloPointedResult[]) {
        super(competitionClassId, name, r);
        this.results = r
    }

    private getPlace = (r:SingleRaceSoloPointedResult):string => `${r.place ?? ""}`
    private getNameClub = (r:SingleRaceSoloPointedResult):string => `${r.name} (${r.club})`
    private getName = (r:SingleRaceSoloPointedResult):string => `${r.name}`
    private getClub = (r:SingleRaceSoloPointedResult):string => `${r.club}`
    private getTime = (r:SingleRaceSoloPointedResult):string => `${this.timeWithStatusString(r)}`
    private getPoints = (r:SingleRaceSoloPointedResult):string => `${r.points ?? ""}`

    render(style:RenderStyles): string {
        switch (style) {
            case RenderStyles.standard_txt: 
                return this.render_txt();
            case RenderStyles.standard_html: 
                return this.render_html();
            case RenderStyles.cascade_wordpresshtml:
                return this.cascade_wordpresshtml();
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
            this.getPlace,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            this.getNameClub,
            this.results)
        
        const TIME = new PlaintextColumn(
            "Time",
            this.getTime,
            this.results,
            "start")

        const PTS = new PlaintextColumn(
            "Pts",
            this.getPoints,
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
            this.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            this.getNameClub
        )
        const TIME = new HtmlColumn(
            "Time",
            this.getTime,
            "text-right"
        )
        const PTS = new HtmlColumn(
            "Points",
            this.getPoints,
            "text-right"
        )
        const table = new HtmlTable([PL,NAME,TIME,PTS],this,this.results).doc
        doc.appendChild(table)
        return this.stringify_html(doc)
    }

    cascade_wordpresshtml():string {
        let doc = document.createElement("div")
        doc.setAttribute("class", "lg-mrg-bottom")
        const h3 = document.createElement("h3")
        h3.textContent = `${this.name}`
        h3.setAttribute("id", `competition-class-${this.id.toString()}`)
        doc.appendChild(h3);
        
        if (this.totalFinishers() === 0) {
            const p = document.createElement("p")
            p.textContent = "(No participants for this class)"
            doc.appendChild(p)
            return this.stringify_html(doc)
        }

        const PL = new HtmlColumn(
            "Pos", 
            this.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            this.getName
        )
        const CLUB = new HtmlColumn(
            "Club",
            this.getClub
        )
        const TIME = new HtmlColumn(
            "Time",
            this.getTime,
            "text-right"
        )
        const PTS = new HtmlColumn(
            "Score",
            this.getPoints,
            "text-right"
        )
        const table = new HtmlTable([PL,NAME,CLUB,TIME,PTS],this,this.results).doc
        doc.appendChild(table)

        const menudiv = document.createElement("div")
        const p = document.createElement("p")
        p.setAttribute("class", "lg-mrg-bottom text-center");
        const a = document.createElement("a")
        a.setAttribute("href", "#lt-menu")
        a.textContent = `Menu`
        p.appendChild(a)
        menudiv.appendChild(p)
        doc.appendChild(menudiv)

        return this.stringify_html(doc)
    }
}