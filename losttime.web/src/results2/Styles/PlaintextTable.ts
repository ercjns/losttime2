import { PlaintextColumn } from "./PlaintextColumn";

export class PlaintextTable {

    columns: PlaintextColumn[]
    data: any[] // items are fed to a PlaintextColumn render function
    tableString: string
    topchar: string
    colSep: string
    bodySep: string
    junction: string
    bottomchar: string
    

    constructor(
        columns: PlaintextColumn[],
        data: any[], //
        topchar = "-",
        colSep = "|",
        bodySep = "=",
        junction = "+",
        bottomchar = "-"
    ) {
        this.columns = columns
        this.data = data
        this.topchar = topchar
        this.colSep = colSep
        this.bodySep = bodySep
        this.junction = junction
        this.bottomchar = bottomchar
        this.tableString = this._buildDocument()
    }

    _buildDocument() {
        let doc = "";
        let topLine = "";
        let headerLine = "";
        let splitLine = "";
        let bottomLine = ""

        this.columns.forEach((col:PlaintextColumn) => {
            topLine += this.junction + "".padStart(col.width, this.topchar)
            headerLine += this.colSep
            const whitespace = col.width - col.header.length;
            const left = Math.floor(whitespace/2);
            headerLine += col.header.padStart(left+col.header.length, " ").padEnd(col.width, " ");
            splitLine += this.junction + "".padStart(col.width, this.bodySep)
            bottomLine += this.junction + "".padStart(col.width, this.bottomchar)
        }
        )
        topLine += this.junction + "\r\n";
        headerLine += this.colSep + "\r\n";
        splitLine += this.junction + "\r\n";
        bottomLine += this.junction + "\r\n\r\n";

        doc += topLine ;
        doc += headerLine;
        doc += splitLine;

        for (const el of this.data) {
            this.columns.forEach((col:PlaintextColumn) => {
                doc += this.colSep;
                (col.pad === "start") ?
                    doc += col.renderer(el).padStart(col.width, " ") :
                    doc += col.renderer(el).padEnd(col.width, " ")
            });
            doc += this.colSep;
            doc += "\r\n";
        }

        doc += bottomLine;

        return doc;
    }

}