import { StandardRaceClassData } from "../../StandardRaceClassData";
import { SelectableRaceClass } from "./SelectableRaceClass";
import React, { useState } from "react";
import { Button, Col, Collapse, Row, Table } from "react-bootstrap";
import { CompetitionClassPresetsCustom } from "./CompetitionClassPresetsCustom";
import { ScoreMethodSelect } from "./ScoreMethodSelect";
import { Standard_Time } from "../../CompetitionClass/Variants/Standard_Time";
import { CompetitionClass } from "../../CompetitionClass/CompetitionClass";
import { Cascade_SingleSoloWorldCup } from "../../CompetitionClass/Variants/Cascade_SingleSoloWorldCup";
import { CompetitionClassPresetsStandard } from "./CompetitionClassPresetsStandard";
import { Cascade_SingleSoloScottish1k } from "../../CompetitionClass/Variants/Cascade_SingleSoloScottish1k";
import { Results2ScoreMethod } from "../../CompetitionClassType";
import { Cascade_SingleTeamWorldCup } from "../../CompetitionClass/Variants/Cascade_SingleTeamWorldCup";
import { WizardSectionTitle } from "../../../shared/WizardSectionTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Standard_ScoreO } from "../../CompetitionClass/Variants/Standard_ScoreO";
import { Cascade_SingleSoloScoreOScottish1k } from "../../CompetitionClass/Variants/Cascade_SingleSoloScoreOScottish1k";
import { Cascade_ManySoloWorldCup } from "../../CompetitionClass/Variants/Cascade_ManySoloWorldCup";
import { RaceResultsData } from "../FileLoader";

function getUniqueClassLabels(raceResultsData:RaceResultsData[]) {
    let classLabels:Map<string, string> = new Map();
    [...raceResultsData].map((race) =>
        [...race.raceClasses].map(([shortName,raceClass]) =>
            classLabels.set(raceClass.class.code, raceClass.class.name)
        )
    );
    const sorted = [...classLabels.keys()].sort();
    return sorted.map((code) => {
        return {short:code, long:classLabels.get(code)}
    })
}

function pivotByRaceToByClass(raceResultsData:RaceResultsData[]) {
    const rows = getUniqueClassLabels(raceResultsData);
    const cols = raceResultsData;

    let outData: Map<string,Array<StandardRaceClassData|undefined>> = new Map();
    rows.forEach((raceClass) => {
        let matchingRaces: Array<StandardRaceClassData|undefined> = [];
        cols.forEach((race) => {
            matchingRaces.push(race.raceClasses.get(raceClass.short.toString()))
        })
        outData.set(raceClass.short.toString(),matchingRaces);
    });
    return outData;
}

interface CompetitionClassComposerProps {
    raceResultsData:RaceResultsData[];
    competitionClasses:CompetitionClass[];
    setCompetitionClasses:Function;
}


export function CompetitionClassComposer(props:CompetitionClassComposerProps) {

    const [selectedRaceClasses, setSelectedRaceClasses] = useState(Array<string>())
    const [scoringParams, setScoringParams] = useState(Results2ScoreMethod.SingleSolo_Time)
    const [advancedOpen, setAdvancedOpen] = useState(false)

    const columnHeaders = props.raceResultsData.map((el) =>
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

    const rows = [...pivotByRaceToByClass(props.raceResultsData).entries()]
        .map(([code, raceClass]) =>
            <tr key={code.toString().concat("-tr")}>
                <td key={code}>{code}</td>
                {makeTableDataForClass(raceClass)}
            </tr>
    );

    function handleScoreMethodChange(e:React.ChangeEvent<HTMLInputElement>) {
        setScoringParams(Number(e.target.value));
    }

    function getRaceClassDataForSelected() {
        let res:StandardRaceClassData[] = [];
        [...props.raceResultsData].forEach((race) =>
        [...race.raceClasses].forEach(([shortName,raceClass]) => {
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
        switch (scoringParams) {
            case Results2ScoreMethod.SingleSolo_Time :
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Standard_Time(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`, 
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.SingleSolo_Cascade_WorldCup :
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Cascade_SingleSoloWorldCup(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.SingleSolo_Cascade_Scottish1k :
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Cascade_SingleSoloScottish1k(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.SingleTeam_Cascade_WorldCup :
                props.setCompetitionClasses((current:CompetitionClass[]) => 
                    [...current, new Cascade_SingleTeamWorldCup(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.SingleSolo_ScoreO :
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Standard_ScoreO(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.SingleSolo_ScoreO_Cascade_Scottish1k :
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Cascade_SingleSoloScoreOScottish1k(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            case Results2ScoreMethod.ManySolo_Cascade_WorldCup:
                props.setCompetitionClasses((current:CompetitionClass[]) =>
                    [...current, new Cascade_ManySoloWorldCup(
                        `${getRaceClassDataForSelected()[0]!.class.name}`+
                        `${getRaceClassDataForSelected().length > 1 ? " and More" : ""}`,
                        getRaceClassDataForSelected()
                    )]
                );
                break;
            default :
                new Error("not implemented")
        };
        // clear selection after adding class
        setSelectedRaceClasses([])
    }

    const icon = props.raceResultsData.length > 0 ? 
            (props.competitionClasses.length > 0 ? "check" : "arrow") : "none"

    return (
        <Row>
        <WizardSectionTitle title="Define Classes" showLine={true} icon={icon}/>
        <Col sm={6}>
        <p><strong>Standard:</strong> replicate the classes from your results software file. Only supported for single events.
        </p>
        <CompetitionClassPresetsStandard
            raceResultsData={props.raceResultsData}
            raceClassesByClass={pivotByRaceToByClass(props.raceResultsData)}
            setCompetitionClasses={props.setCompetitionClasses}
        />
        </Col>
        
        <Col sm={6}>
        <p><strong>Custom Templates:</strong> pre-defined class scoring setups for your events and series (requests are welcome!)
        </p>
        <CompetitionClassPresetsCustom 
            raceResultsData={props.raceResultsData}
            raceClassesByClass={pivotByRaceToByClass(props.raceResultsData)}
            setCompetitionClasses={props.setCompetitionClasses}
        />
        </Col>

        <Row className="mb-4">
            <Col sm={6} md={4}>
            <Button 
            onClick={() => setAdvancedOpen(!advancedOpen)}
            variant="outline-secondary"
            size="sm"
            disabled={(props.raceResultsData.length < 1)}
            aria-controls="advanced-definition" 
            aria-expanded={advancedOpen}>Advanced Settings {advancedOpen ? <FontAwesomeIcon icon={faChevronUp}/> : <FontAwesomeIcon icon={faChevronDown}/>}</Button>
            </Col>
        
            <Collapse in={advancedOpen && props.raceResultsData.length > 0}>
            <div id="advanced-definition">
                <p>
                    <strong>Advanced:</strong> Select race classes from one or more races to combine into a single competition class. Click each button to select or de-select, then select a scoring method and click "Add Competition Class." Repeat as needed. Class names can be edited in the next section.
                    When selecting a single event scoring method, all results from selected classes will be combined as if the times were from a single course/class, even if they were not!
                </p>
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
                <p>
                Selected Race Classes: {selectedRaceClasses.length}
                </p>
                <ScoreMethodSelect 
                    handleScoringParamsChange={handleScoreMethodChange}/>
                <Button className="mb-2"
                    onClick={()=>createCompetitionClass()}
                    disabled={(selectedRaceClasses.length < 1)}
                    variant='outline-primary'>
                    Add Competition Class
                </Button>
            </div>
            </Collapse>
        </Row>
        </Row>
    )
}