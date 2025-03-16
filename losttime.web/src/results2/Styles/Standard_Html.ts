import { ComputedCompetitionClass } from "../ComputedCompetitionClass/ComputedCompetitionClass";
import { RenderStyleWrapper } from "./RenderStyleWrapper";
import { RenderStyles } from "./RenderStyles";

export class Standard_Html extends RenderStyleWrapper {

    styleEnumValue = RenderStyles.standard_html;
    extension = "html"

    render(): string {
        let doc = ""
        doc += this.beginDoc()
        doc += this.menuContent()
        this.data.forEach((c) =>
            doc += c.render_html());
        doc += this.endDoc()
        return doc
    }

    private beginDoc(): string {
        return `<!doctype html>
        <html lang="en">\r\n
        <head>\r\n
        <title>Results</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r\n
        <meta charset="UTF-8" />
        <style>${this.style}</style>\r\n
        </head>\r\n
        <body>\r\n`;
    }
    style:string = `
    tr:nth-child(even) {background-color: #f2f2f2;}\r\n
    .text-right {text-align: right}
    `
    private menuContent(): string {
        const div = document.createElement("div")
        const h2 = document.createElement("h2")
        h2.textContent = "Competition Classes"
        div.appendChild(h2)
        const ul = document.createElement("ul")
        this.data.forEach((x) => {
            const li = document.createElement("li")
            const a = document.createElement("a")
            a.textContent = `${x.name}`
            a.setAttribute("href", `#competition-class-${x.id.toString()}`)
            li.appendChild(a)
            ul.appendChild(li)
        })
        div.appendChild(ul)
        return this.stringify_html(div)
    }

    private endDoc(): string {
        return "</body>\r\n</html>";
    }


}