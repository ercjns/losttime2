export class TeamInfo {
    teamName: string
    clubCode?: string

    constructor(name:string, code?:string) {
        this.teamName = name;
        this.clubCode = code;
    }

    isSame(other:TeamInfo):boolean {
        if (this.teamName === other.teamName &&
            this?.clubCode === other?.clubCode
        ) { return true; }
        return false;
    }
}