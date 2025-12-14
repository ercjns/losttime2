import { RenderStyleWrapper } from "./RenderStyleWrapper";
import { RenderStyles } from "./RenderStyles";

export class Cascade_WifiHtml extends RenderStyleWrapper {

    styleEnumValue = RenderStyles.cascade_wifihtml;
    extension = "html"

    render(): string {
        let doc = ""
        doc += this.beginDoc()
        doc += this.topContent()
        doc += this.menuContent()
        this.data.forEach((c) => {
            doc += c.render(this.styleEnumValue)
            doc += this.midContent()
        })
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
    .text-right {text-align: right}\r\n
    p.text-warn {color: chocolate; font-style: italic;}
    p.text-danger {color: crimson; font-style: italic; font-weight: bold;}
    `

    updateWhenStale(generatedAt:number) {
        const tenStale = new Date(generatedAt + 10*60000) // 10min
        const twentyStale = new Date(generatedAt + 20*60000) // 20min
        let current = new Date()
        if (twentyStale < current) {
            const toUpdate = document.getElementsByClassName("last-updated")
            for (let el of toUpdate) {
                if (!el.classList.contains("text-danger")) {
                    el.classList.add("text-danger")
                    el.append(" If this message remains and Download isn't busy, let them know results aren't updating.")
                }
                if (el.classList.contains("text-warn")) {
                    el.classList.remove("text-warn")
                    el.append()
                }
            };
        } else if (tenStale < current) {
            const toUpdate = document.getElementsByClassName("last-updated")
            for (let el of toUpdate) {
                if (!el.classList.contains("text-warn")) {
                    el.classList.add("text-warn")
                    el.append(" Now more than 10 minutes old. Refresh the page.")
                }
            };
        } else {
            console.log("Data is Current")
        }
    }

    private topContent(): string {
        const div = document.createElement("div")
        if (this.isSingleRace()) {
            const p2 = document.createElement("p")
            p2.textContent = `Total Starts: ${this.totalCompetitionStarts()}`
            div.appendChild(p2)
        }
        return this.stringify_html(div)
    }

    private menuContent(): string {
        const div = document.createElement("div")
        const h2 = document.createElement("h2")
        h2.setAttribute("id", "lt-menu")
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

    private midContent(): string {
        const midDiv = document.createElement("div")
        const p = document.createElement("p")
        p.setAttribute("class", "text-center");
        const a = document.createElement("a")
        a.setAttribute("href", "#lt-menu")
        a.textContent = `Competition Classes Menu`
        p.appendChild(a)
        midDiv.appendChild(p)
        const lastUpdated = document.createElement("p")
        lastUpdated.setAttribute("class", "last-updated")
        lastUpdated.textContent = `Preliminary results generated at ${this.timeString}. New results about every 5 minutes.`
        midDiv.appendChild(lastUpdated)

        return this.stringify_html(midDiv)
    }

    private endDoc(): string {
        return `</body>\r\n
        <script>\r\n
        function ${this.updateWhenStale.toString()}
        updateWhenStale(${this.now.getTime()});
        setInterval(() => updateWhenStale(${this.now.getTime()}), 15*1000);
        </script>\r\n
        </html>`;
    }


}