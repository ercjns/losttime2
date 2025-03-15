import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloPointedResult } from "../CompetitionClass/SingleRaceSoloPointedResult";
import { RenderStyle } from "../Styles/RenderStyles";

export class Computed_Ousa_SingleSoloAvgWinTime extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloPointedResult[]) {
        super(competitionClassId, name, r);
    }

    render(style:RenderStyle): string {
        switch (style) {
            case RenderStyle.standard_txt:
                return this.render_txt();
            case RenderStyle.standard_html:
                return this.render_html();
            default: 
                return this.render_html();
        }
    }

    render_txt():string {
        if (this.totalFinishers() === 0) {
            return "";
        }
        let doc = "";
        for (const el of this.results as SingleRaceSoloPointedResult[]) {
            doc += `Place: ${el.place} `;
            doc += `Name: ${el.name} (${el.club}) `;
            doc += `Time: ${this.timeWithStatusString(el)} `;
            doc += `Points: ${el.points}`;
            doc += "\r\n";
        }
        return doc;
    }

    render_html():string {
        return this.render_txt()
    }
}