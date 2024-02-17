// model this on lt/Entry.ts

// import React from 'react';
import { Class, Course, Event, PersonResult, ResultList, ClassResult } from "../shared/orienteeringtypes/IofResultXml";
// import { IndividualScoreMethod } from './CompetitionClass';
import { Guid } from 'guid-typescript';


export class LtStaticRaceClassResult {
    ID:Guid;
    Event:Event;
    Class:Class;
    Course:Course;
    PersonResults:PersonResult[];

    constructor(rawClassResult: ClassResult, event:Event) {
        this.ID = Guid.create();
        this.Event = event;
        this.Class = rawClassResult.Class;
        this.Course = rawClassResult.Course;
        this.PersonResults = rawClassResult.PersonResult
    }
}


export class LtStaticRaceResult {
    Event!: Event;
    ClassResults!: LtStaticRaceClassResult[];

    fromSplitsRaceResult(
        splitsRaceResult: ResultList
    ) {
        // console.log(splitsRaceResult);
        this.Event = splitsRaceResult.Event;
        this.ClassResults = splitsRaceResult.ClassResult.map(
            (el) => (new LtStaticRaceClassResult(el, this.Event)))

        return this;
    }
}

export function parseRaceResult(indata:ResultList): LtStaticRaceResult {
    return new LtStaticRaceResult().fromSplitsRaceResult(indata);
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
