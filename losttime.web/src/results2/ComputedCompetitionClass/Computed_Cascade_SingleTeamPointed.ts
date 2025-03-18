import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";
import { HtmlColumn } from "../Styles/HtmlColumn";
import { HtmlTable } from "../Styles/HtmlTable";
import { SingleRaceTeamResult } from "../CompetitionClass/SingleRaceTeamResult";
import { CodeCheckingStatus } from "../../results/scoremethods/IofStatusParser";

export class Computed_Cascade_SingleTeamPointed extends ComputedCompetitionClass {

    results:SingleRaceTeamResult[]
    mixedResults: (SingleRaceTeamResult|SingleRaceSoloPointedResult)[]

    constructor(competitionClassId:Guid, name:string, r: SingleRaceTeamResult[]) {
        super(competitionClassId, name, r);
        this.results = r
        this.mixedResults = this.buildMixedResults()
    }

    private buildMixedResults():(SingleRaceTeamResult|SingleRaceSoloPointedResult)[] {
        let res:(SingleRaceTeamResult|SingleRaceSoloPointedResult)[] = []
        this.results.forEach((team) => {
            res.push(team);
            team.soloResults.forEach((r) => {
                res.push(r)
            })
        })
        return res;
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
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    return `${r.place}`
                } else {
                    return ``
                }
            },
            this.mixedResults,
            "start")

        const NAME = new PlaintextColumn(
            "Name",
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    return `${r.teamName} (${r.club})`
                } else {
                    return `->${r.name}`
                }
            },
            this.mixedResults)
        
        const PTS = new PlaintextColumn(
            "Pts",
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => `${r.points}`,
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
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    return `${r.place}`
                } else {
                    return ``
                }
            }
        )
        const PTS = new HtmlColumn(
            "Points",
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    return `${r.points}`
                } else {
                    return `${r.points ?? ""}`
                }
            },
            "text-right"
        )
        const NAME = new HtmlColumn(
            "Name",
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    return `${r.teamName} (${r.club})`
                } else {
                    return `${r.name} (${r.club})`
                }
            }
        )
        const FINISH = new HtmlColumn(
            "Finish",
            (r:SingleRaceTeamResult|SingleRaceSoloPointedResult):string => {
                if (r instanceof SingleRaceTeamResult) {
                    const fin = r.soloResultsAll.filter((x)=>x.codeChecking===CodeCheckingStatus.FIN).length
                    const pct = Math.round(fin*100/r.soloResultsAll.length)
                    return `${pct}% (${fin} of ${r.soloResultsAll.length})`
                } else {
                    return `${this.timeWithStatusString(r)}`
                }
            }
        )
        const table = new HtmlTable([PL,PTS,NAME,FINISH],this,this.mixedResults).doc;
        doc.appendChild(table);
        return this.stringify_html(doc);
    }
}