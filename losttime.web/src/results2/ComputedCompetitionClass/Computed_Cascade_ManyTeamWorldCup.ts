import { Guid } from "guid-typescript";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { RenderStyles } from "../Styles/RenderStyles";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { ManyRaceTeamResult } from "../CompetitionClass/ManyRaceTeamResult";


export class Computed_Cascade_ManyTeamPointed extends ComputedCompetitionClass {

    results:ManyRaceTeamResult[]
    totalEvents:number

    constructor(competitionClassId:Guid, name:string, r: ManyRaceTeamResult[]) {
        super(competitionClassId, name, r);
        this.results = r
        this.totalEvents = this.results[0] ? this.results[0].raceResults.length : 0
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

    private getEventPoints = (eventNumber:number) => {
        return (r:ManyRaceTeamResult):string => {
            if (r.resultsSummary[eventNumber].hasResult === false) {
                return "";
            } else if (r.resultsSummary[eventNumber].points === undefined) {
                return "";
            } else {
                return r.resultsSummary[eventNumber].points!.toString()
            }
        }
    }

    private getSeasonDecoratorClasses = (eventNumber:number) => {
        return (r?:ManyRaceTeamResult):string|undefined => {
            if (r===undefined) {return}
            let res = "";
            if (r.resultsSummary[eventNumber].hasResult === false) {
                return undefined
            } else {
                if (r.resultsSummary[eventNumber].isContributing === true) {
                    res += "season-contributing "
                } 
                if (r.resultsSummary[eventNumber].place === 1) {
                    res += "season1 "
                } else if (r.resultsSummary[eventNumber].place === 2) {
                    res += "season2 "
                } else if (r.resultsSummary[eventNumber].place === 3) {
                    res += "season3 "
                }
                return res;
            }
        }
    };

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
            ManyRaceTeamResult.getPlace,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            ManyRaceTeamResult.getTeamClub,
            this.results)

        let RaceColumns:PlaintextColumn[] = [];
        for (let i = 0; i < this.totalEvents; i++) {
            const COL = new PlaintextColumn(
                '#'.concat((i+1).toString()),
                this.getEventPoints(i),
                this.results,
                "start"
            )
            RaceColumns.push(COL)
        }

        const PTS = new PlaintextColumn(
            "Pts",
            ManyRaceTeamResult.getPoints,
            this.results,
            "start")
        
        return doc += new PlaintextTable([PL,NAME,...RaceColumns,PTS], this.results).tableString;
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
            ManyRaceTeamResult.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            ManyRaceTeamResult.getTeamClub
        )
        let RaceColumns:HtmlColumn[] = [];
        for (let i = 0; i < this.totalEvents; i++) {
            const COL = new HtmlColumn(
                '#'.concat((i+1).toString()),
                this.getEventPoints(i),
                this.getSeasonDecoratorClasses(i)
            )
            RaceColumns.push(COL)
        }
        const PTS = new HtmlColumn(
            "Points",
            ManyRaceTeamResult.getPoints,
            ()=>"text-right"
        )

        const table = new HtmlTable([PL,NAME,...RaceColumns,PTS],this,this.results).doc;
        doc.appendChild(table);
        return this.stringify_html(doc);
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
            "Place",
            ManyRaceTeamResult.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            ManyRaceTeamResult.getTeamClub
        )
        let RaceColumns:HtmlColumn[] = [];
        for (let i = 0; i < this.totalEvents; i++) {
            const COL = new HtmlColumn(
                '#'.concat((i+1).toString()),
                this.getEventPoints(i),
                this.getSeasonDecoratorClasses(i)
            )
            RaceColumns.push(COL)
        }
        const PTS = new HtmlColumn(
            "Points",
            ManyRaceTeamResult.getPoints,
            ()=>"text-right"
        )

        const table = new HtmlTable([PL,NAME,...RaceColumns,PTS],this,this.results).doc;
        doc.appendChild(table);

        const menudiv = document.createElement("div")
        const p = document.createElement("p")
        p.setAttribute("class", "lg-mrg-bottom text-center");
        const a = document.createElement("a")
        a.setAttribute("href", "#lt-menu")
        a.textContent = `Menu`
        p.appendChild(a)
        menudiv.appendChild(p)
        doc.appendChild(menudiv)

        return this.stringify_html(doc);
    }
};
