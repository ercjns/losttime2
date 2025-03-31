import { Guid } from "guid-typescript";
import { SingleRaceSoloScoreOResult } from "../CompetitionClass/SingleRaceSoloScoreOResult";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { RenderStyles } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";

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

        if (this.totalFinishers() === 0) {
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
        return ""
    }

    cascade_wordpresshtml(): string {
        return ""
    }
}