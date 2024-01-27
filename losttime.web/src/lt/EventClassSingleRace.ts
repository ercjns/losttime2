export type ltEventClassSingleRace = {
    eventclass_id: number,
    raceclass_id: number,
    name: string,
    name_short: string,
    race_scoring: string,
    event_scoring: string,
    raceresults: filledRaceResult[]
    teamresults?: singleTeamResult[]
  }

export type filledRaceResult = {
  result: ltRaceResult,
  entry: ltRaceEntry, 
  time: number,
  score?: number,
  pos?: number
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
  club: string,
  bib: string,
  epunch: string,
  raceclass_id: number,
  competitive: boolean
}

export type singleTeamResult = {
  club: string,
  score: number,
  results: filledRaceResult[]
}