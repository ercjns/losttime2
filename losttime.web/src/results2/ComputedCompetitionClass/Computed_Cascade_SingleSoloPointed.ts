import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { RenderStyle } from "../Styles/RenderStyles";
import { PlaintextColumn } from "../Styles/PlaintextColumn";
import { PlaintextTable } from "../Styles/PlaintextTable";

export class Computed_Cascade_SingleSoloPointed extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloPointedResult[]) {
        super(competitionClassId, name, r);
    }

    render(style:RenderStyle): string {
        switch (style) {
            case RenderStyle.standard_txt: 
                return this.render_txt();
            case RenderStyle.standard_html: 
            case RenderStyle.cascade_wifihtml:
            case RenderStyle.cascade_wordpresshtml:
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
        return this.render_txt()
    }
}