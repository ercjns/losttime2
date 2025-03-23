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
        return `
        <div>
        <h3>Result Status Codes</h3>
        <dl class="dl-horizontal">
          <dt>msp: missing punch</dt>
          <dd>a control was skipped or taken out of order</dd>
          <dt>dnf: did not finish</dt>
          <dd>
            a control or set of controls at the end of the course were skipped
          </dd>
          <dt>nc: not competing</dt>
          <dd>
            the competitor is not eligible for standings, such as when running a
            second course
          </dd>
          <dt>dq: disqualified</dt>
          <dd>
            breaking competition rules, such as conferring with another competitor
            or entering an out of bounds area
          </dd>
          <dt>ovt: overtime</dt>
          <dd>returning after the course closure time</dd>
          <dt>dns: did not start</dt>
          <dd>the competitor did not start</dd>
          <dt>&lt;time&gt;*</dt>
          <dd>
            the star indicates course completion status was not reported and may be
            valid, msp, or dnf
          </dd>
        </dl>
        </div>
    </div>`
    }


}