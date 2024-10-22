import { isWiolEntryCsv, WiolEntryCsv } from "../orienteering/WiolEntry"
import { CascadeRegistrationCsv, isCascadeRegistrationCsv } from "../orienteering/CascadeRegistration"

export type ParseResult = {
    data: LtEntry[],
    meta: {
      success: number,
      failed: number,
      empty: number,
      maxstartno: number,
    }
  }

export class LtEntry {
    StartNo!: number | null;
    Epunch!: string;
    EpunchRented!: true | false;
    FirstName!: string;
    LastName!: string;
    Club!: string;
    Course!: string;
    ClassId!: string;
    NonCompetitive!: true | false;
    Sex!: "F" | "M";
    Phone!: string;
    EmergencyPhone!: string;
    CarLicense!: string;
    Newcomer!: true | false | "unknown";
    Group!: number;
    GroupId!: number | null;
    GroupLeader!: boolean;
    Paid!: true | false | "unknown";
    Owed!: number;
    SignedWaiver!: true | false;

    fromWiolEntryCsv(
        entry: WiolEntryCsv
    ) {
        this.StartNo = entry["Bib"];
        this.Epunch = entry["SI Card"];
        this.EpunchRented= (entry.Rental === 'X') ? true: false;
        this.FirstName= entry["First Name"];
        this.LastName= entry["Last Name"];
        this.Club= entry["School Code"];
        this.Course= '';
        this.ClassId= entry.Course;
        this.NonCompetitive= (entry.NC === 'X') ? true:false;
        this.Sex= entry.Gender;
        this.Phone= '';
        this.EmergencyPhone= '';
        this.CarLicense= '';
        this.Newcomer= "unknown";
        this.Group= 1;
        this.GroupLeader= true;
        this.Paid= "unknown";
        this.Owed= 0;
        this.SignedWaiver= true;

        return this;
    }
    fromCascadeRegistrationCsv(
        entry: CascadeRegistrationCsv,
        nextGroupId: number | null
    ) {
        this.StartNo = null;
        this.Epunch = entry.EPunch
        this.EpunchRented= (entry.Rental.toUpperCase() === 'TRUE' || entry.Rental.toUpperCase() === 'X') ? true:false;
        this.FirstName= entry.FirstName
        this.LastName= entry.LastName
        this.Club= entry.Club
        this.Course= '';
        this.ClassId= entry.Class;
        this.NonCompetitive= false;
        this.Sex= entry.Sex
        this.Phone= entry.Phone
        this.EmergencyPhone= entry.EmergencyPhone;
        this.CarLicense= entry.CarLicense
        this.Newcomer= (entry.Newcomer.toUpperCase() === 'TRUE') ? true:false;
        this.Group= (entry.Group) ? (entry.Group === '*' ? 0 : entry.Group): 1;
        this.GroupLeader= (entry.Group === '*') ? false : true;
        this.GroupId= nextGroupId;
        this.Paid= (entry.Paid.toUpperCase() === 'TRUE') ? true:false;
        this.Owed= (entry.Owed) ? entry.Owed: 0;
        this.SignedWaiver= (entry.Waiver.toUpperCase() === 'TRUE') ? true:false;

        return this;
    }
}

export function parseEnties(indata:any[], nextbib?:number): ParseResult {

    const newentries:LtEntry[] = [];
    let empty = 0;
    let failed = 0;
    let nextgroupid = 0;
    for (const row of indata) {

        if (isWiolEntryCsv(row)) {
            const e = new LtEntry().fromWiolEntryCsv(row);
            newentries.push(e);
            continue;
        } else if (isCascadeRegistrationCsv(row) === "group") {
            if (row.Group !== '*') {nextgroupid += 1;} 
            const e = new LtEntry().fromCascadeRegistrationCsv(row,nextgroupid);
            newentries.push(e);
            continue;
        } else if (isCascadeRegistrationCsv(row) === true) {
            const e = new LtEntry().fromCascadeRegistrationCsv(row,null);
            newentries.push(e);
            continue;
        } else if (Object.keys(row).length <= 1) {
            console.log(Object.keys(row))
            console.log('empty row');
            empty += 1;
            continue;
        } else {
            console.log(Object.keys(row))
            console.log('failed to parse row');
            failed += 1;
        }
    }

    return {
        data: newentries,
        meta: {
            success: newentries.length,
            failed: failed,
            empty: empty,
            maxstartno: Math.max(...newentries.map(o => o.StartNo? o.StartNo:1001))
        }
    }
}
