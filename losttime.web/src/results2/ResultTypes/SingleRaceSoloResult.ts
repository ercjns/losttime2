import { CodeCheckingStatus, CompetitiveStatus, iofStatusParser } from "../../results/scoremethods/IofStatusParser";
import { PersonResult } from "../../shared/orienteeringtypes/IofResultXml";

export class SingleRaceSoloResult {
    _raw: PersonResult;
    name: string;
    club: string;
    time: number; // TODO: HANDLE UNDEFINED TIME??
    place: number | null | undefined;
    codeChecking: CodeCheckingStatus;
    competitive: CompetitiveStatus;

    constructor(personResult: PersonResult) {
        this._raw = personResult;
        this.name = this._extractName()
        this.club = this._extractClub()
        this.time = this._extractTime()
        const s = this._extractStatuses()
        this.codeChecking = s.CodeCheckingStatus;
        this.competitive = s.CompetitiveStatus
    }
    _extractName() {
        return (this._raw.Person.Name.Given + " " + this._raw.Person.Name.Family).trim();
    }

    _extractClub() {
        return this._raw.Organisation.ShortName;
    }

    _extractTime() {
        return this._raw.Result.Time;
    }

    _extractStatuses() {
        return iofStatusParser(this._raw.Result.Status);
    }

}

export function compareSingleSoloByTime(a:SingleRaceSoloResult, b:SingleRaceSoloResult):number {
    if (a.competitive !== b.competitive) {
        return a.competitive - b.competitive;
    }
    if (a.codeChecking !== b.codeChecking) {
        return a.codeChecking - b.codeChecking;
    }
    if (a.time && b.time) {
        return a.time - b.time;
    }
    if (a.time) {
        return -1;
    } else if (b.time) {
        return 1;
    } else {
        return 0;
    }
}