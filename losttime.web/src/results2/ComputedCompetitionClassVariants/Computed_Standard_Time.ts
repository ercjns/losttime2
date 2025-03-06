import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../ResultTypes/SingleRaceSoloResult";
import { RenderStyle } from "../RenderStyles";

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
            return doc;
        }
        for (const el of this.results as SingleRaceSoloResult[]) {
            doc += `Place: ${el.place} `;
            doc += `Name: ${el.name} (${el.club}) `;
            doc += `Time: ${this.timeWithStatusString(el)} `;
            doc += "\r\n";
        }
        return doc;
    }

    render_html():string {
        return this.render_txt()
    }
}