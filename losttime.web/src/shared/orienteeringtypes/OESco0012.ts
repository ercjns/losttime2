// 0OESco0012
// Stno
// XStno
// Chipno
// Database Id
// Surname
// First name"
// YB
// S
// Block
// nc
// Start
// Finish
// Time"
// Classifier"
// Credit -"
// Penalty +"
// Comment"
// Club no."
// Cl.name"
// City"
// Nat"
// Location"
// Region"
// Cl. no."
// Short"
// Long"
// Entry cl. No"
// Entry class (short)"
// Entry class (long)"
// Rank"
// Ranking points"
// Num1"
// Num2"
// Num3"
// Text1"
// Text2"
// Text3"
// Addr. surname"
// Addr. first name"
// Street"
// Line2"
// Zip"
// Addr. city"
// Phone"
// Mobile"
// Fax"
// EMail"
// Rented"
// Start fee"
// Paid"
// Team"
// Course no."
// Course"
// Course controls"
// Max. points"
// Time limit"
// Place"
// Score Result"
// Points"
// Score Penalty"
// Extra points"
// Comment (Xtra)"

import { LtPerson } from "./LtPerson"
import { LtScoreOResult } from "./LtScoreOResult"
import { TimeStringToSeconds } from "./timeHelpers"


export type OESco0012 = {
    // possibly everything is a string??
    Chipno: string
    Surname: string
    "First name": string
    YB:number
    S: "M" | "F"
    nc: 0 | "X"
    Start: string
    Finish: string
    Time: string
    City: string // Club abbreviation short
    Region: string // Club full name
    Short: string // Class code
    Long: string // Class name
    Rented: 0 | "X"
    "Course no.": string
    Course: string
    "Course controls": number
    "Max. points": number
    "Time limit": string
    "Place": number | "nc"
    "Score Result": number
    Points: number
    "Score Penalty": number
    "Extra points": number
}

export function OEScoCsvToLtScoreOResult(r:OESco0012):LtScoreOResult {
    const person = new LtPerson(r["First name"], r.Surname, r.City, r.Region)
    let timeInSeconds = TimeStringToSeconds(r.Time)
    
    if (Number.isNaN(timeInSeconds)) {
        if (r.Start && r.Finish) {
            timeInSeconds = TimeStringToSeconds(r.Finish) - TimeStringToSeconds(r.Start)
        }
    }
    // TODO timeInSeconds might still be NaN

    return new LtScoreOResult({
        person: person,
        card: r.Chipno,
        start: r.Start,
        finish: r.Finish,
        time: timeInSeconds,
        status: r.nc === "X" ? "NotCompeting" : "OK",
        position: r.Place === "nc" ? undefined : r.Place,
        scoreRaw: r.Points,
        penalty: r["Score Penalty"],
        bonus: r["Extra points"],
        score: r["Score Result"]
    })
}