export class HtmlColumn {

    header: string
    renderer: Function
    classNames?: string

    constructor(
        header: string,
        renderer: Function,
        classNames?: string
    ) {
        this.header = header
        this.renderer = renderer
        this.classNames = classNames
    }

}