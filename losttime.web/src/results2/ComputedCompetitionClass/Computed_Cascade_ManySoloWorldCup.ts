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
    totalEvents:number

    constructor(competitionClassId:Guid, name:string, r: ManyRaceSoloResult[]) {
        super(competitionClassId, name, r);
        this.results = r
        this.totalEvents = this.results[0].raceResults.length
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

    private getEventPoints = (eventNumber:number) => {
        return (r:ManyRaceSoloResult):string => {
            if (r.resultsSummary[eventNumber].hasResult === false) {
                return "";
            } else if (r.resultsSummary[eventNumber].points === undefined) {
                return "";
            } else {
                return r.resultsSummary[eventNumber].points!.toString()
            }
        }
    }

    private getSeasonDecorators = (eventNumber:number) => {
        return (r:ManyRaceSoloResult):string|undefined => {
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
            ManyRaceSoloResult.getPlace,
            this.results,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            ManyRaceSoloResult.getNameClub,
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
            ManyRaceSoloResult.getPoints,
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
            ManyRaceSoloResult.getPlace
        )
        const NAME = new HtmlColumn(
            "Name",
            ManyRaceSoloResult.getNameClub
        )
        let RaceColumns:HtmlColumn[] = [];
        for (let i = 0; i < this.totalEvents; i++) {
            const COL = new HtmlColumn(
                '#'.concat((i+1).toString()),
                this.getEventPoints(i),
                this.getSeasonDecorators(i)
            )
            RaceColumns.push(COL)
        }
        const PTS = new HtmlColumn(
            "Points",
            ManyRaceSoloResult.getPoints,
            ()=>"text-right"
        )

        const table = new HtmlTable([PL,NAME,...RaceColumns,PTS],this,this.results).doc;
        doc.appendChild(table);
        return this.stringify_html(doc);
    }
};
