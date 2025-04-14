


export type genericResult = {
    name: {
        first?: string
        last?: string
    }
    club: {
        name: string
        shortName?: string
    }
    ControlCard?: number;
    StartTime?: string;
    FinishTime?: string;
    Time: number;
    Status?: string;
    Position?: number;
}

export type genericScoreResult = {
    name: {
        first?: string
        last?: string
    }
    club: {
        name: string
        shortName?: string
    }
    ControlCard?: number;
    StartTime?: string;
    FinishTime?: string;
    Time: number;
    Status?: string;
    Position?: number;
    RawScore: number,
    Penalty: number,
    Bonus: number,
    NetScore: number
}