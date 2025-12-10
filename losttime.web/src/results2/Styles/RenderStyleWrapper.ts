import { html_beautify } from "js-beautify";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";

export abstract class RenderStyleWrapper {

    data: ComputedCompetitionClass[]
    abstract extension:string
    abstract styleEnumValue:number
    now: Date
    timeString: string

    constructor(data:ComputedCompetitionClass[]) {
        this.data = data
        this.now = new Date()
        this.timeString = this.now.toLocaleTimeString()
    }

    abstract render():string

    stringify_html(html:HTMLElement) {
        const wrap = document.createElement("div");
        wrap.appendChild(html);
        return html_beautify(wrap.innerHTML);
    }

    isSingleRace():boolean {
        return this.data.every(x => x.isSingleRace())
    }

    totalCompetitionStarts():number {
        let ans = 0;
        this.data.forEach((competitionClass) => {
            if(competitionClass.isIndividuals()) {
                ans += competitionClass.totalClassStarts()
            }
        })
        return ans
    }

}