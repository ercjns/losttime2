import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";
import { HtmlColumn } from "./HtmlColumn";


export class HtmlTable {
    columns: HtmlColumn[]
    computedClass: ComputedCompetitionClass
    data: any[]
    doc: HTMLElement

    constructor(
        columns: HtmlColumn[],
        computedClass: ComputedCompetitionClass,
        data: any[]
    ) {
        this.columns = columns
        this.computedClass = computedClass
        this.data = data
        this.doc = this._buildDocument()
    }

    _buildDocument() {
        const table = document.createElement("table");
        table.setAttribute("class", "table table-striped");
        table.setAttribute("id", `competition-class-table-${this.computedClass.id.toString()}`);

        const thead = document.createElement("thead");
        const trhead = document.createElement("tr");
        this.columns.forEach((col:HtmlColumn) => {
            trhead.appendChild(_docElement("th", col.header))
        })
        thead.appendChild(trhead);
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        for (const r of this.data) {
            const trdata = document.createElement("tr");
            this.columns.forEach((col:HtmlColumn) => {
                trdata.appendChild(_docElement("td", col.renderer(r), col.classNames))
            })
            tbody.appendChild(trdata)
        }

        table.appendChild(tbody);
        return table;
    }

}

function _docElement(element:string, text:string, classNames?:string) {
    const el = document.createElement(element)
    el.textContent = text;
    if (classNames) {
        el.setAttribute("class", classNames)
    }
    return el
}