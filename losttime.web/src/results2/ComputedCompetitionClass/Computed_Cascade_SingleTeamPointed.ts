import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../CompetitionClass/SingleRaceSoloResult";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";
import { SingleRaceTeamResult } from "../CompetitionClass/SingleRaceTeamResult";
import { CodeCheckingStatus } from "../../shared/orienteeringtypes/RaceStatuses";

export class Computed_Cascade_SingleTeamPointed extends ComputedCompetitionClass {

    results:SingleRaceTeamResult[]
    mixedResults: (SingleRaceTeamResult|SingleRaceSoloResult)[]

    constructor(competitionClassId:Guid, name:string, r: SingleRaceTeamResult[]) {
        super(competitionClassId, name, r);
        this.results = r
        this.mixedResults = this.buildMixedResults()
    }

    private buildMixedResults():(SingleRaceTeamResult|SingleRaceSoloResult)[] {
        let res:(SingleRaceTeamResult|SingleRaceSoloResult)[] = []
        this.results.forEach((team) => {
            res.push(team);
            team.soloResults.forEach((r) => {
                res.push(r)
            })
        })
        return res;
    }

    private getTeamPlace = (r:SingleRaceTeamResult|SingleRaceSoloResult):string => {
        if (r instanceof SingleRaceTeamResult) {
            return `${r.place}`
        } else {
            return ``
        }
    }

    private getTeamOrSoloNameArrowIndent = (r:SingleRaceTeamResult|SingleRaceSoloResult):string => {
        if (r instanceof SingleRaceTeamResult) {
            return SingleRaceTeamResult.getTeamClub(r)
        } else {
            return `->${SingleRaceSoloResult.getName(r)}`
        }
    }

    private getPoints = (r:SingleRaceTeamResult|SingleRaceSoloResult):string => `${r.points ?? ""}`

    private getTeamOrSoloName = (r:SingleRaceTeamResult|SingleRaceSoloResult):string => {
        if (r instanceof SingleRaceTeamResult) {
            return SingleRaceTeamResult.getTeamClub(r)
        } else {
            return SingleRaceSoloResult.getNameClub(r)
        }
    }

    private getTeamFinishStatsOrSoloTime = (r:SingleRaceTeamResult|SingleRaceSoloResult):string => {
        if (r instanceof SingleRaceTeamResult) {
            const fin = r.soloResultsAll.filter((x)=>x.codeChecking===CodeCheckingStatus.FIN).length
            const pct = Math.round(fin*100/r.soloResultsAll.length)
            return `${pct}% (${fin} of ${r.soloResultsAll.length})`
        } else {
            return `${this.timeWithStatusString(r)}`
        }
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
            this.getTeamPlace,
            this.mixedResults,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            this.getTeamOrSoloNameArrowIndent,
            this.mixedResults)
        
        const PTS = new PlaintextColumn(
            "Pts",
            this.getPoints,
            this.mixedResults,
            "start")
        
        return doc += new PlaintextTable([PL,NAME,PTS], this.mixedResults).tableString;
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
            this.getTeamPlace
        )
        const PTS = new HtmlColumn(
            "Points",
            this.getPoints,
            ()=>"text-right"
        )
        const NAME = new HtmlColumn(
            "Name",
            this.getTeamOrSoloName
        )
        const FINISH = new HtmlColumn(
            "Finish",
            this.getTeamFinishStatsOrSoloTime
        )
        const table = new HtmlTable([PL,PTS,NAME,FINISH],this,this.mixedResults).doc;
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
            "Pos",
            this.getTeamPlace
        )
        const PTS = new HtmlColumn(
            "Score",
            this.getPoints
        )
        const NAME = new HtmlColumn(
            "Name",
            this.getTeamOrSoloName
        )
        const FINISH = new HtmlColumn(
            "Finish",
            this.getTeamFinishStatsOrSoloTime
        )
        const table = new HtmlTable([PL,PTS,NAME,FINISH],this,this.mixedResults).doc;
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
}