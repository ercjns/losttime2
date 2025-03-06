import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { SelectableRaceClass } from "./SelectableRaceClass";
import React, { useState } from "react";
import { Button, Col, Collapse, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";
import { CompetitionClassPresetsCustom } from "./CompetitionClassPresetsCustom";
import { CompetitionClassScoringParameters } from "./CompetitionClassScoringParameters";
import { IndividualScoreMethod } from "../../results/CompetitionClass";
import { ScoringParameters } from "../ScoringParameters";
import { Standard_Time } from "../CompetitionClassDefinitionVariants/Standard_Time";
import { CompetitionClass } from "../CompetitionClass";
import { Cascade_SingleSoloWorldCup } from "../CompetitionClassDefinitionVariants/Cascade_SingleSoloWorldCup";
import { CompetitionClassPresetsStandard } from "./CompetitionClassPresetsStandard";

export type raceClassesByRace = Map<Guid,Map<string,StandardRaceClassData>>;

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
    setCompetitionClasses:Function;
}


export function CompetitionClassComposer(props:CompetitionClassComposerProps) {

    const [selectedRaceClasses, setSelectedRaceClasses] = useState(Array<string>())
    const [scoringParams, setScoringParams] = useState(new ScoringParameters())
    const [advancedOpen, setAdvancedOpen] = useState(false)

    const columnHeaders = getRaces(props.raceClassesByRace).map((el) =>
        <th key={el.id.toString()}>{el.name}</th>
    );

    function handleRaceClassClick(e:React.ChangeEvent<HTMLInputElement>) {
        const updated:string[] = selectedRaceClasses.slice();
        if (e.target.checked) {
            updated.push(e.target.value)
        } else {
            const indx = updated.indexOf(e.target.value);
            if (indx > -1) {
                updated.splice(indx,1)
            }
        }
        setSelectedRaceClasses(updated);
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
                        checked={selectedRaceClasses.includes(raceClass.id.toString())}
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

    function handleIndividualScoreMethodChange(e:React.ChangeEvent<HTMLInputElement>) {
        setScoringParams({
            ...scoringParams, 
            individual:Number(e.target.value)
        });
    }

    function getRaceClassDataForSelected() {
        let res:StandardRaceClassData[] = [];
        [...props.raceClassesByRace].map(([raceid,raceClasses]) =>
        [...raceClasses].map(([shortName,raceClass]) => {
            if (selectedRaceClasses.includes(raceClass.id.toString())) {
                res.push(raceClass)
            }
        }));
        if (res.length === 0) {
            throw Error("No raceclasses selected")
        }
        return res;
    }

    function createCompetitionClass() {
        switch (scoringParams.individual) {
            case IndividualScoreMethod.Time :
                console.log("creating Time competition class!")
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Standard_Time(
                    "placeholder title", 
                    getRaceClassDataForSelected()
                    )]
                );
                break;
            case IndividualScoreMethod.PointsCocWorldCup :
                console.log("creating COC World Cup competition class!")
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Cascade_SingleSoloWorldCup(
                        "placeholder title",
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            default :
                new Error("not implemented")
        };
    }

    return (
        <Row>
        <SectionTitle title="2. Define Classes" line={true} />

        <p><strong>Standard:</strong> replicate the classes from your results software file. Only supported for single events.
        </p>
        <CompetitionClassPresetsStandard
            raceClassesByRace={props.raceClassesByRace}
            raceClassesByClass={pivotByRaceToByClass(props.raceClassesByRace)}
            setCompetitionClasses={props.setCompetitionClasses}
        />
        
        <p><strong>Custom Templates:</strong> pre-defined class scoring setups for your events and series (requests are welcome!)
        </p>
        <CompetitionClassPresetsCustom 
            raceClassesByRace={props.raceClassesByRace}
            raceClassesByClass={pivotByRaceToByClass(props.raceClassesByRace)}
            setCompetitionClasses={props.setCompetitionClasses}
        />

        <p><strong>Advanced:</strong> manually define competition classes by selecting which race classes to consider and scoring methods to apply
        </p>
        <Row className="mb-4">
            <Col sm={6} md={4}>
            <Button 
            onClick={() => setAdvancedOpen(!advancedOpen)}
            variant="outline-secondary"
            aria-controls="advanced-definition" 
            aria-expanded={advancedOpen}>{advancedOpen ? "Hide advanced settings" : "Show advanced settings"}</Button>
            </Col>
        
            <Collapse in={advancedOpen}>
            <div id="advanced-definition">
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
                <CompetitionClassScoringParameters 
                    handleScoringParamsChange={handleIndividualScoreMethodChange}/>
                <Button onClick={()=>createCompetitionClass()}>Add Competition Class</Button>
            </div>
            </Collapse>
        </Row>
        </Row>
    )
}