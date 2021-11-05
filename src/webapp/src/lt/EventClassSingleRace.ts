export type ltEventClassSingleRace = {
    eventclass_id: number,
    raceclass_id: number,
    name: string,
    scoring: string,
    raceresults: filledRaceResult[]
  }

export type filledRaceResult = {
  result: ltRaceResult,
  entry: ltRaceEntry, 
  time: number
}

type ltRaceResult = {
  id: number,
  raceentry_id: number,
  start_time: Date,
  end_time: Date,
  course_completed: string,
  finish_status: string
}

type ltRaceEntry = {
  id: number,
  person: string,
  bib: string,
  epunch: string,
  raceclass_id: number,
  competitive: boolean
}