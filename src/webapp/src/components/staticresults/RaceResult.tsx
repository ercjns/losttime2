// model this on lt/Entry.ts

import React from 'react';
import { Class, Course, Event, PersonResult, ResultList } from "../../orienteering/IofResultXml";

export type SplitsByClassXmlParseResult = {
    data: LtStaticRaceResult,
    meta: {
        count: number
    }
}

export class LtStaticClassResult {
    Event!:Event;
    Class!:Class;
    Course!:Course;
    PersonResult!:PersonResult[];
}


export class LtStaticRaceResult {
    Event!: Event;
    ClassResults!: LtStaticClassResult[];

    fromSplitsRaceResult(
        splitsRaceResult: ResultList
    ) {
        this.Event = splitsRaceResult.Event;
        this.ClassResults = splitsRaceResult.ClassResult.map(
            (el) => ({...el, Event:splitsRaceResult.Event}))

        return this;
    }
}

export function parseRaceResult(indata:ResultList): LtStaticRaceResult {
    return new LtStaticRaceResult().fromSplitsRaceResult(indata);
}


export class RaceClassListItem extends React.Component<{raceClassName: string, resultsCount: number}, {}, {}> {

  render () {
  return (
    <li>{this.props.raceClassName} ({this.props.resultsCount} results)</li>
  );
  }

}
