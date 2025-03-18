import { Guid } from "guid-typescript";
import { SingleRaceSoloResult } from "../CompetitionClass/SingleRaceSoloResult";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { CodeCheckingStatus, CompetitiveStatus } from "../../results/scoremethods/IofStatusParser";
import { RenderStyles } from "../Styles/RenderStyles";
import { html_beautify } from "js-beautify";
import { SingleRaceTeamResult } from "../CompetitionClass/SingleRaceTeamResult";


export abstract class ComputedCompetitionClass {
    id: Guid;
    competitionClassId: Guid;
    name: string;
    createdAt: Date;
    results: SingleRaceSoloResult[] | SingleRaceTeamResult[];

    constructor(
        competitionClassId: Guid,
        name: string,
        results: any[]
    ) {
        this.id = Guid.create();
        this.createdAt = new Date();
        this.competitionClassId = competitionClassId;
        this.name = name;
        this.results = results;
    }

    // Required render methods for all CompetitionClassResult implementations
    abstract render(s:RenderStyles): string
    abstract render_txt():string
    abstract render_html():string

    // derived classes may have more render methods
    // generally, they'll have one or more renderers that are the reason 
    // this specific result type exists

    // helpers for render actions
    totalFinishers() {
        return this.results.length;
    }

    timeNumberAsMMMSS(time:number|undefined) {
        if (time === undefined) {return "--:--"}
        const mins = Math.floor(time / 60)
        const secs = time % 60;
        return mins.toString() + ":" + secs.toString().padStart(2, "0");
    }

    timeWithStatusString(result:SingleRaceSoloResult) {
        if (result.codeChecking === CodeCheckingStatus.FIN &&
             result.competitive === CompetitiveStatus.COMP) {
                return this.timeNumberAsMMMSS(result.time);     
        } else if (result.codeChecking !== CodeCheckingStatus.UNK) {
            return `${CodeCheckingStatus[result.codeChecking]} ${this.timeNumberAsMMMSS(result.time)}`
        } else {
            return `${CompetitiveStatus[result.competitive]} ${this.timeNumberAsMMMSS(result.time)}*`
        }
    }

    stringify_html(html:HTMLElement) {
        const wrap = document.createElement("div");
        wrap.appendChild(html);
        return html_beautify(wrap.innerHTML);
    }
}