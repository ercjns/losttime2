
export class CompetitionClassPresetButton {
    org: string
    id: string
    label: string
    onClick: Function
    // Function that should return true when this button should be enabled
    // has access to CompetitionClassPresetsProps
    isEnabledWhen: Function

    constructor(
        org: string,
        id: string,
        label: string,
        onClick: Function,
        isEnabledWhen?: Function
    ) {
        this.org = org
        this.id = id
        this.label = label
        this.onClick = onClick
        if (isEnabledWhen) {
            this.isEnabledWhen = isEnabledWhen
        } else {
            this.isEnabledWhen = ()=>true
        }
    }
}
