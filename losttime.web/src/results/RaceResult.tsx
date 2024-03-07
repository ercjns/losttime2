// model this on lt/Entry.ts

// import React from 'react';
import { Class, Course, PersonResult, ResultList, ClassResult } from "../shared/orienteeringtypes/IofResultXml";
// import { IndividualScoreMethod } from './CompetitionClass';
import { Guid } from 'guid-typescript';


export type LtEvent = {
    ID:Guid;
    Name:string;
    Order: number;
}

export class LtStaticRaceClassResult {
    ID:Guid;
    Event:LtEvent;
    Class:Class;
    Course:Course;
    PersonResults:PersonResult[];

    constructor(rawClassResult: ClassResult, event:LtEvent) {
        this.ID = Guid.create();
        this.Event = event;
        this.Class = rawClassResult.Class;
        this.Course = rawClassResult.Course;
        this.PersonResults = rawClassResult.PersonResult
    }
}


export class LtStaticRaceResult { //rename to LtStaticRace?
    Event!: LtEvent;
    ClassResults!: LtStaticRaceClassResult[];

    fromSplitsRaceResult(
        splitsRaceResult: ResultList,
        raceOrder: number
    ) {
        // console.log(splitsRaceResult);
        this.Event = {
            ID: Guid.create(),
            Name:splitsRaceResult.Event.Name,
            Order:raceOrder
        }
        this.ClassResults = splitsRaceResult.ClassResult.map(
            (el) => (new LtStaticRaceClassResult(el, this.Event)))

        return this;
    }
}

export function parseRaceResult(indata:ResultList, uploadOrder:number): LtStaticRaceResult {
    return new LtStaticRaceResult().fromSplitsRaceResult(indata, uploadOrder);
}


// export class CompetitionClassSelector extends React.Component<{
//     selectedRaceClasses: LtStaticRaceClassResult[],
//     isTeamClass: Boolean,
//     scoreMethod: IndividualScoreMethod}, {}, {}> {

//     render () {
//     return "Foobar";
//     }

//     }

// export class RaceClassListItem extends React.Component<{
//     raceClassName: string, 
//     raceClassCode: string|undefined,
//     resultsCount: number}, {}, {}> {

//   render () {
//   return (
//     <li key={this.props.raceClassCode}>{this.props.raceClassCode} {this.props.raceClassName} ({this.props.resultsCount} results)</li>
//   );
//   }

// }
