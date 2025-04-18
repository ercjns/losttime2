export class PlaintextColumn {

    header: string
    renderer: Function
    width: number
    pad: "start" | "end"

    constructor(
        header: string,
        renderer: Function,
        data: any[], // items are fed to a render function
        pad: "start" | "end" = "end"
    ) {
        this.header = header
        this.renderer = renderer
        this.pad = pad
        this.width = this._plaintextColumnWidth(data)
    }

    private _plaintextColumnWidth(data:any[]):number {
        return data
            .map((item) => this.renderer(item).length)
            .reduce((longest, current) => 
                Math.max(longest, current), this.header.length)
    }
}


