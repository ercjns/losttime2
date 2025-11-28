import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "./ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../CompetitionClass/SingleRaceSoloResult";
import { RenderStyles } from "../Styles/RenderStyles";

export class Computed_Ousa_SingleSoloAvgWinTime extends ComputedCompetitionClass {
    constructor(competitionClassId:Guid, name:string, r: SingleRaceSoloResult[]) {
        super(competitionClassId, name, r);
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

    render_txt():string {
        if (this.totalClassStarts() === 0) {
            return "";
        }
        let doc = "";
        for (const el of this.results as SingleRaceSoloResult[]) {
            doc += `Place: ${el.place} `;
            doc += `Name: ${el.person.first + el.person.last} (${el.person.clubCode}) `;
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