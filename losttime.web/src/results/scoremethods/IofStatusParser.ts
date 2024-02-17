export enum CodeCheckingStatus {
    FIN,
    MSP,
    DNF,
    UNK
}

export enum CompetitiveStatus {
    COMP,
    SWD,
    OVT,
    NC,
    DSQ
}

class RaceStatuses {
    CompetitiveStatus:CompetitiveStatus;
    CodeCheckingStatus:CodeCheckingStatus;

    constructor(comp_status:CompetitiveStatus, codecheck_status:CodeCheckingStatus) {
        this.CompetitiveStatus = comp_status;
        this.CodeCheckingStatus = codecheck_status;
    }
}

export function iofStatusParser (status:string): RaceStatuses {
    switch (status) {
        case "OK":
            return new RaceStatuses(CompetitiveStatus.COMP, CodeCheckingStatus.FIN)
        case "DidNotFinish":
            return new RaceStatuses(CompetitiveStatus.COMP, CodeCheckingStatus.DNF)
        case "MissingPunch":
            return new RaceStatuses(CompetitiveStatus.COMP, CodeCheckingStatus.MSP)
        case "NotCompeting":
            return new RaceStatuses(CompetitiveStatus.NC, CodeCheckingStatus.UNK)
        case "Disqualified":
            return new RaceStatuses(CompetitiveStatus.DSQ, CodeCheckingStatus.UNK)
        case "Overtime":
            return new RaceStatuses(CompetitiveStatus.OVT, CodeCheckingStatus.UNK)
        default:
            return new RaceStatuses(CompetitiveStatus.NC, CodeCheckingStatus.UNK)
    }
}