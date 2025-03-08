import { Guid } from "guid-typescript";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass";
import { SingleRaceSoloResult } from "../ResultTypes/SingleRaceSoloResult";
import { RenderStyle } from "../RenderStyles";
import { PlaintextColumn } from "../PlaintextColumn";


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
        
        const cols = [A,B,C];

        // inspired by (but DIY and demonstrably worse than) https://github.com/ozh/ascii-tables
        // TODO: move this into a helper class that all plaintext renderers can use
        // otherwise code below will get copied between all plaintext renderers.

        const topchar = "-";
        const colSep = "|";
        const bodySep = "=";
        const junction = "+";
        const bottomchar = "-";
        
        let topLine = "";
        let headerLine = "";
        let splitLine = "";
        let bottomLine = ""

        cols.forEach((col:PlaintextColumn) => {
            topLine += junction + "".padStart(col.width, topchar)
            headerLine += colSep
            const whitespace = col.width - col.header.length;
            const left = Math.floor(whitespace/2);
            headerLine += col.header.padStart(left+col.header.length, " ").padEnd(col.width, " ");
            splitLine += junction + "".padStart(col.width, bodySep)
            bottomLine += junction + "".padStart(col.width, bottomchar)
        }
        )
        topLine += junction + "\r\n";
        headerLine += colSep + "\r\n";
        splitLine += junction + "\r\n";
        bottomLine += junction + "\r\n\r\n";

        doc += topLine ;
        doc += headerLine;
        doc += splitLine;

        for (const el of this.results as SingleRaceSoloResult[]) {
            cols.forEach((col:PlaintextColumn) => {
                doc += colSep;
                (col.pad === "start") ?
                    doc += col.renderer(el).padStart(col.width, " ") :
                    doc += col.renderer(el).padEnd(col.width, " ")
            });
            doc += colSep;
            doc += "\r\n";
        }

        doc += bottomLine;

        return doc;
    }

    render_html():string {
        return this.render_txt()
    }
}