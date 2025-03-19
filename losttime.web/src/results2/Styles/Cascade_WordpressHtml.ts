import { RenderStyleWrapper } from "./RenderStyleWrapper";
import { RenderStyles } from "./RenderStyles";

export class Cascade_WordpressHtml extends RenderStyleWrapper {

    styleEnumValue = RenderStyles.cascade_wordpresshtml;
    extension = "html"

    render(): string {
        let doc = ""
        doc += this.beginDoc()
        doc += this.menuContent()
        this.data.forEach((c) =>
            doc += c.render(this.styleEnumValue));
        doc += this.endDoc()
        return doc
    }

    private beginDoc(): string {
        return `<div class="LostTimeContent">`;
    }

    private menuContent(): string {
        const div = document.createElement("div")
        const h2 = document.createElement("h2")
        h2.textContent = "Competition Classes"
        h2.setAttribute("id", "lt-menu")
        div.appendChild(h2)
        this.data.forEach((x) => {
            const h4 = document.createElement("h4")
            const a = document.createElement("a")
            a.textContent = `${x.name}`
            a.setAttribute("href", `#competition-class-${x.id.toString()}`)
            h4.appendChild(a)
            div.appendChild(h4)
        })
        return this.stringify_html(div)
    }

    private endDoc(): string {
        return "</div>";
    }


}