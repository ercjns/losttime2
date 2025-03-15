import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../ResultTypes/SingleRaceSoloResult";
import { RenderStyle } from "../RenderStyles";
import { PlaintextColumn } from "../PlaintextColumn";
import { PlaintextTable } from "../PlaintextTable";


export class Computed_Standard_Time extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloResult[]) {
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
        
        const A = new PlaintextColumn(
            "Pl",
            (r:SingleRaceSoloResult):string => `${r.place ?? ""}`,
            this.results,
            "start")

        const B = new PlaintextColumn(
            "Name",
            (r:SingleRaceSoloResult):string => `${r.name} (${r.club})`,
            this.results)
        
        const C = new PlaintextColumn(
            "Time",
            (r:SingleRaceSoloResult):string => `${this.timeWithStatusString(r)}`,
            this.results,
            "start")
        
        return doc += new PlaintextTable([A,B,C], this.results).tableString;
    }

    render_html():string {
        return this.render_txt()
    }
}