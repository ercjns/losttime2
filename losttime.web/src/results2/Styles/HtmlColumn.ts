export class HtmlColumn {

    header: string
    renderer: Function
    classNames?: Function

    constructor(
        header: string,
        renderer: Function,
        classNames?: Function
    ) {
        this.header = header
        this.renderer = renderer
        this.classNames = classNames
    }

}