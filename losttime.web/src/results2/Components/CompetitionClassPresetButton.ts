
export class CompetitionClassPresetButton {
    org: string
    id: string
    label: string
    onClick: Function

    constructor(
        org: string,
        id: string,
        label: string,
        onClick: Function
    ) {
        this.org = org
        this.id = id
        this.label = label
        this.onClick = onClick
    }
}
