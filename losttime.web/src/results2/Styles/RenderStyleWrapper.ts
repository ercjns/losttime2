import { html_beautify } from "js-beautify";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";

export abstract class RenderStyleWrapper {

    data: ComputedCompetitionClass[]
    abstract extension:string
    abstract styleEnumValue:number

    constructor(data:ComputedCompetitionClass[]) {
        this.data = data
    }

    abstract render():string

    stringify_html(html:HTMLElement) {
        const wrap = document.createElement("div");
        wrap.appendChild(html);
        return html_beautify(wrap.innerHTML);
    }

}