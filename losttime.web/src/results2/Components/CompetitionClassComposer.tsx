import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { SelectableRaceClass } from "./SelectableRaceClass";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";

type raceClassesByRace = Map<Guid,Map<string,StandardRaceClassData>>;

type raceInfo = {
    id:Guid,
    name:string
}

function getUniqueClassLabels(raceClassesByRace:raceClassesByRace) {
    let classLabels:Map<string, string> = new Map();
    [...raceClassesByRace].map(([raceid,raceClasses]) =>
        [...raceClasses].map(([shortName,raceClass]) =>
            classLabels.set(raceClass.xmlClass.ShortName, raceClass.xmlClass.Name)
        )
    );
    const sorted = [...classLabels.keys()].sort();
    return sorted.map((code) => {
        return {short:code, long:classLabels.get(code)}
    })
}

function getRaces(raceClassesByRace:raceClassesByRace) {
    let raceNames:raceInfo[] = [];
    raceClassesByRace.forEach((race) => {
        const anyRaceClass = race.values().next().value
        if (anyRaceClass === undefined) {new Error("Race has no raceclasses?")}
        else {
            raceNames.push({
                id: anyRaceClass.race_id,
                name: anyRaceClass.race_name
            });
        }
    });
    return raceNames;
}

function pivotByRaceToByClass(raceClassesByRace:raceClassesByRace) {
    const rows = getUniqueClassLabels(raceClassesByRace);
    const cols = getRaces(raceClassesByRace);

    let outData: Map<string,Array<StandardRaceClassData|undefined>> = new Map();
    rows.forEach((raceClass) => {
        let matchingRaces: Array<StandardRaceClassData|undefined> = [];
        cols.forEach((race) => {
            matchingRaces.push(raceClassesByRace.get(race.id)?.get(raceClass.short))
        })
        outData.set(raceClass.short,matchingRaces);
    });
    return outData;
}

interface CompetitionClassComposerProps {
    raceClassesByRace:raceClassesByRace;
}

export function CompetitionClassComposer(props:CompetitionClassComposerProps) {

    const [checked, setChecked] = useState(Array())

    const columnHeaders = getRaces(props.raceClassesByRace).map((el) =>
        <th key={el.id.toString()}>{el.name}</th>
    );

    function handleRaceClassClick(e:React.ChangeEvent<HTMLInputElement>) {
        const updated:string[] = checked.slice();
        if (e.target.checked) {
            updated.push(e.target.value)
        } else {
            const indx = updated.indexOf(e.target.value);
            if (indx > -1) {
                updated.splice(indx,1)
            }
        }
        setChecked(updated);
    }

    function makeTableDataForClass(
        racesInClass:Array<StandardRaceClassData|undefined>) {
        return racesInClass.map((raceClass) => {
            if (raceClass === undefined) {
                return <td>(no results)</td>
            } else {
                return <td key={raceClass.id.toString().concat("-td")}>
                    <SelectableRaceClass 
                        raceClass={raceClass} 
                        checked={checked.includes(raceClass.id.toString())}
                        onChange={handleRaceClassClick}
                        />
                    </td>
            }
        });
    }

    const rows = [...pivotByRaceToByClass(props.raceClassesByRace).entries()]
        .map(([code, raceClass]) =>
            <tr key={code.toString().concat("-tr")}>
                <td key={code}>{code}</td>
                {makeTableDataForClass(raceClass)}
            </tr>
    );

    return (
        <div>
        <SectionTitle title="2. Define Classes" line={true} />
        <Table striped hover size="sm">
            <thead>
            <tr>
                <th>Class</th>
                {columnHeaders}
            </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            
        </Table>
        This is responsible for allowing the user to compose competition classes
        User can compose by selecting from available races and available score methods given their race selection
        There should be some shortcuts / presets
        (It's not done yet)

        A different component is responsible for taking the collection competition classes and creating output for the user.
        </div>
    )
}