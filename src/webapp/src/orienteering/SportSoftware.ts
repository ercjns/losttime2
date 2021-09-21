import { LtEntry } from "../lt/Entry";

export type OeEntryCsv = {
    Stno: number,
    Chipno: string | null,
    "Database Id":null,
    Surname: string | null,
    "First name": string | null
    S: string,
    nc: 0|1,
    Classifier: 0,
    City: string | null,
    Short: string | null,
    Rented: "X" | null,
    "Start fee":0,
    Paid:"X"
  }

export function fromLtEntries(entries: LtEntry[]): OeEntryCsv[] {
  let OeEntries:OeEntryCsv[] = [];
  let nextstartno:number;
  const maxstartnoinuse = Math.max(...entries.map(o => o.StartNo? o.StartNo:0))
  nextstartno = maxstartnoinuse > 1001 ? maxstartnoinuse+1 : 1001;

  for (let e of entries) {
    if (!e.StartNo) {
      e.StartNo = nextstartno;
      nextstartno++;
    }
    OeEntries.push(convertFromLtEntry(e));
  }
  return OeEntries;
}

function convertFromLtEntry(entry:LtEntry): OeEntryCsv {
  if (!entry.StartNo) {
    throw new Error('Start number is required');
  }
  return {
    Stno: entry.StartNo,
    Chipno: entry.Epunch.toString(),
    "Database Id":null,
    Surname: entry.LastName,
    "First name": entry.FirstName,
    S: entry.Sex,
    nc: entry.NonCompetitive ? 1:0,
    Classifier: 0,
    City: entry.Club,
    Short: entry.ClassId,
    Rented: entry.EpunchRented ? "X" : null,
    "Start fee":0,
    Paid: "X"
  }
}

export const COLUMNS_STANDARD = [
    "OE0001",
    "Stno",
    "XStno",
    "Chipno",
    "Database Id",
    "Surname",
    "First name",
    "YB",
    "S",
    "Block",
    "nc",
    "Start",
    "Finish",
    "Time",
    "Classifier",
    "Credit -",
    "Penalty +",
    "Comment",
    "Club no.",
    "Cl.name",
    "City",
    "Nat",
    "Location",
    "Region",
    "Cl. no.",
    "Short",
    "Long",
    "Entry cl. No",
    "Entry class (short)",
    "Entry class (long)",
    "Rank",
    "Ranking points",
    "Num1",
    "Num2",
    "Num3",
    "Text1",
    "Text2",
    "Text3",
    "Addr. surname",
    "Addr. first name",
    "Street",
    "Line2",
    "Zip",
    "Addr. city",
    "Phone",
    "Mobile",
    "Fax",
    "EMail",
    "Rented",
    "Start fee",
    "Paid",
    "Team",
    "Course no.",
    "Course",
    "km",
    "m",
    "Course controls"
  ]

export const COLUMNS_SCOREO = [
  "OESco0001",
  "Stno",
  "XStno",
  "Chipno",
  "Database Id",
  "Surname",
  "First name",
  "YB",
  "S",
  "Block",
  "nc",
  "Start",
  "Finish",
  "Time",
  "Classifier",
  "Credit -",
  "Penalty +",
  "Comment",
  "Club no.",
  "Cl.name",
  "City",
  "Nat",
  "Location",
  "Region",
  "Cl. no.",
  "Short",
  "Long",
  "Entry cl. No",
  "Entry class (short)",
  "Entry class (long)",
  "Rank",
  "Ranking points",
  "Num1",
  "Num2",
  "Num3",
  "Text1",
  "Text2",
  "Text3",
  "Addr. surname",
  "Addr. first name",
  "Street",
  "Line2",
  "Zip",
  "Addr. city",
  "Phone",
  "Mobile",
  "Fax",
  "EMail",
  "Rented",
  "Start fee",
  "Paid",
  "Team",
  "Course no.",
  "Course",
  "km",
  "m",
  "Course controls"
]
