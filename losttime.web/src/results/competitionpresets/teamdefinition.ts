import { Guid } from "guid-typescript";

export class TeamDefinition {
    ID: Guid;
    Name: string;
    School?: string;
    Level: TeamLevel;
    Type: TeamType;
    Members: number[];

    constructor(
        name:string,
        school:string|undefined,
        level:TeamLevel,
        type:TeamType,
        bibs:number[]) {
            this.ID = Guid.create();
            this.Name = name;
            this.School = school;
            this.Level = level;
            this.Type = type;
            this.Members = bibs;
        }
}

export class RaceTeams {
    Teams: TeamDefinition[];

    constructor() {
        this.Teams = [];
    }

    addTeam(team:TeamDefinition) {
        
        // must have at least one member
        if (team.Members.length === 0) {
            
            throw "must have at least one member to add team to race"
        }

        // can't include members currently assigned on other teams
        team.Members.forEach((bib) => {
            if (this.findTeamByBibNumber(bib) != undefined) {
                throw "bib number already assinged to a team: "+bib
            }
        });

        // can't be the same name as another team in this level (regardless of type)
        this.Teams.forEach((existing) => {
            if (team.Level === existing.Level && team.Name === existing.Name) {
                throw "Aleady have a team of this name at this level " +team.Name
            }
        });

        this.Teams.push(team);
        return;
    }

    allTeamsByLevel(level:TeamLevel):TeamDefinition[] {
        return this.Teams.filter((x) => x.Level === level);
    }

    findTeamByBibNumber(bib:number):TeamDefinition | undefined {
        return this.Teams.find((x) => x.Members.includes(bib));
    }

    findTeamIdStringByBibNumber(bib:number):string {
        const team = this.Teams.find((x) => x.Members.includes(bib));
        if (team === undefined) {return 'undefined';}
        return team.ID.toString();
    }

    getTeamById(id:string):TeamDefinition|undefined {
        return this.Teams.find((x) => x.ID.equals(Guid.parse(id)));
    }
}

export enum TeamLevel {
    Primary,
    Intermediate,
    SchoolJrVarsity,
    SchoolVarsity,
    CollegeJrVarsity,
    CollegeVarsity
}

export enum TeamType {
    Club,
    SchoolOnly,
    JrotcOnly,
    SchoolAndJrotc
}