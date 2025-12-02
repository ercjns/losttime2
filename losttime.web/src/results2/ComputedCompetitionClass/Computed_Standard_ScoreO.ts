import { Guid } from "guid-typescript";
import { SingleRaceSoloScoreOResult } from "../CompetitionClass/SingleRaceSoloScoreOResult";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";

export class Computed_Standard_ScoreO extends ComputedCompetitionClass {

    results: SingleRaceSoloScoreOResult[]

    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloScoreOResult[]) {
        super(competitionClassId, name, r);
        this.results = r
    }

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

    render_txt(): string {
        let doc = "";
        doc += `${this.name}`
        doc += "\r\n";

        if (this.totalClassStarts() === 0) {
            doc += `(No participants for this class)\r\n\r\n`
            return doc;
        }

        const PL = new PlaintextColumn(
            "Pl",
            SingleRaceSoloScoreOResult.getPlace,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            SingleRaceSoloScoreOResult.getNameClub,
            this.results)
        
        const RAW = new PlaintextColumn(
            "Points",
            SingleRaceSoloScoreOResult.getRawScore,
            this.results,
            "start")

        const PEN = new PlaintextColumn(
            "Penalty",
            SingleRaceSoloScoreOResult.getPenalty,
            this.results,
            "start")

        const SCORE = new PlaintextColumn(
            "Score",
            SingleRaceSoloScoreOResult.getFinalScore,
            this.results,
            "start")

        const TIME = new PlaintextColumn(
            "Time",
            SingleRaceSoloScoreOResult.getTimeMMMSS,
            this.results,
            "start")

        return doc += new PlaintextTable([PL,NAME,RAW,PEN,SCORE,TIME], this.results).tableString
    }

    render_html(): string {
        let doc = document.createElement("div")
        const h2 = document.createElement("h2")
        h2.textContent = `${this.name}`
        h2.setAttribute("id", `competition-class-${this.id.toString()}`)
        doc.appendChild(h2);
        
        if (this.totalClassStarts() === 0) {
            const p = document.createElement("p")
            p.textContent = "(No participants for this class)"
            doc.appendChild(p)
            return this.stringify_html(doc)
        }

        const PL = new HtmlColumn(
            "Place", 
            SingleRaceSoloScoreOResult.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            SingleRaceSoloScoreOResult.getNameClub
        )
        const RAW = new HtmlColumn(
            "Points",
            SingleRaceSoloScoreOResult.getRawScore,
            ()=>"text-right"
        )
        const PEN = new HtmlColumn(
            "Penalty",
            SingleRaceSoloScoreOResult.getPenalty,
            ()=>"text-right"
        )
        const SCORE = new HtmlColumn(
            "Score",
            SingleRaceSoloScoreOResult.getFinalScore,
            ()=>"text-right"
        )
        const TIME = new HtmlColumn(
            "Time",
            SingleRaceSoloScoreOResult.getTimeWithStatus,
            ()=>"text-right"
        )
        const table = new HtmlTable([PL,NAME,RAW,PEN,SCORE,TIME],this,this.results).doc
        doc.appendChild(table)
        return this.stringify_html(doc)
    }

    cascade_wordpresshtml(): string {
        let doc = document.createElement("div")
        doc.setAttribute("class", "lg-mrg-bottom")
        const h3 = document.createElement("h3")
        h3.textContent = `${this.name}`
        h3.setAttribute("id", `competition-class-${this.id.toString()}`)
        doc.appendChild(h3);
        
        if (this.totalClassStarts() === 0) {
            const p = document.createElement("p")
            p.textContent = "(No participants for this class)"
            doc.appendChild(p)
            return this.stringify_html(doc)
        }

        const PL = new HtmlColumn(
            "Pos", 
            SingleRaceSoloScoreOResult.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            SingleRaceSoloScoreOResult.getName
        )
        const CLUB = new HtmlColumn(
            "Club",
            SingleRaceSoloScoreOResult.getClubCode
        )
        const RAW = new HtmlColumn(
            "Points",
            SingleRaceSoloScoreOResult.getRawScore,
            ()=>"text-right"
        )
        const PEN = new HtmlColumn(
            "Penalty",
            SingleRaceSoloScoreOResult.getPenalty,
            ()=>"text-right"
        )
        const SCORE = new HtmlColumn(
            "Score",
            SingleRaceSoloScoreOResult.getFinalScore,
            ()=>"text-right"
        )
        const TIME = new HtmlColumn(
            "Time",
            SingleRaceSoloScoreOResult.getTimeMMMSS,
            ()=>"text-right"
        )
        const table = new HtmlTable([PL,NAME,CLUB,RAW,PEN,SCORE,TIME],this,this.results).doc
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