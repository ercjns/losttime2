import { XMLParser } from "fast-xml-parser";
import { useState } from "react";
import { parse as PapaParse, RECORD_SEP, UNIT_SEP, ParseResult } from "papaparse"
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { ClassResult, IofXml3ToLtResult } from "../../shared/orienteeringtypes/IofResultXml";
import { Button, Col, Row } from "react-bootstrap";
import { WizardSectionTitle } from "../../shared/WizardSectionTitle";
import { raceClassesByRace } from "./Compose/CompetitionClassComposer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { OESco0012, OEScoCsvToLtScoreOResult } from "../../shared/orienteeringtypes/OESco0012";
import { LtRaceClass } from "../../shared/orienteeringtypes/LtRaceClass";
import { LtCourse } from "../../shared/orienteeringtypes/LtCourse";
import { BasicDz } from "../../shared/dz";


interface FileLoaderProps {
    raceClassesByRace: raceClassesByRace
    setRaceClasses: Function;
    setCompetitionClasses: Function;
}

interface loadedFile {
    filename: string
    data: StandardRaceClassData[]
    race_id: Guid
}

function setFilesAndRaceClasses(file:File, raceClasses:StandardRaceClassData[], race_id:Guid, setFilesState:Function, fileLoaderProps:FileLoaderProps) {
    setFilesState((existing:loadedFile[]) => 
        [...existing, {filename:file.name, data:raceClasses, race_id: race_id}])

    let raceClassesMap:Map<string,StandardRaceClassData> = new Map()
    raceClasses.forEach((el) =>
    // without toString() here, a ShortName of 1 ends up as an
    // integer type key in the map, causing things to break later.
    raceClassesMap.set(el.class.code.toString(), el))
    
    fileLoaderProps.setRaceClasses((existing: Map<Guid,Map<string,StandardRaceClassData>>) => {
    // https://expertbeacon.com/re-render-react-component-when-its-props-changes-a-comprehensive-guide/
    // if an array prop is passed from parent -> child and mutated in place, the child will not re-render
    // so to add to the map, I can't just Map.set(key,value) - have to build a new Map.
    // this forces the component that gets passed this state as a prop to re-render.
        var updated = new Map()
        existing.forEach((value, key) =>
            updated.set(key, value)
        )
        updated.set(race_id, raceClassesMap);
        return updated;
    })
}

function handleCsvFile(results:ParseResult<any>, file:File, setFilesState:Function, fileLoaderProps:FileLoaderProps) {
    const race_id = Guid.create();
    const race_name = file.name
    
    // detect what type of file this is
    if (results.meta.fields && results.meta.fields[0].startsWith("OESco0012")) {
        
        // get all the unique class values
        // TODO: there's probably a better way to do deep compare rather than this string mess
        //       or I could just not care and look only at codes and join back to the first 
        //       instance of the name, but I'd rather avoid that pattern
        const allClassNames = results.data.map((x:OESco0012) => `${x.Short}::${(x.Long)}`)
        const uniqueClassNames:string[] = allClassNames.filter((val, idx, arr) => arr.indexOf(val) === idx);
        const uniqueLtClasses:LtRaceClass[] = uniqueClassNames.map(s => {
            const [code,name] = s.split("::",2)
            return new LtRaceClass(name,code)
        })
        uniqueLtClasses.sort((a,b) => a.code.localeCompare(b.code));

        // iterate through those to create StandardRaceClassData for each class
        const raceClasses: StandardRaceClassData[] = uniqueLtClasses.map((classInfo:LtRaceClass) =>
            new StandardRaceClassData(
                {id:race_id,name:race_name},
                classInfo,
                results.data.filter((x:OESco0012) => x.Short===classInfo.code).map(OEScoCsvToLtScoreOResult)
        ))
        setFilesAndRaceClasses(file, raceClasses, race_id, setFilesState, fileLoaderProps);
    } else {
        alert("Sorry, don't support generic CSV files yet. Only OEScore csv files.")
        return
    }
}

function handleXmlfile(file:File, setFilesState:Function, fileLoaderProps:FileLoaderProps) {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const reader = new FileReader();
    reader.onload = (e) => {
        if ((e) && (e.target) && (e.target.result)) {
            const resultsObj = parser.parse(e.target.result as string);
            const race_id = Guid.create();
            const race_name = resultsObj.ResultList.Event.Name

            const raceClasses: StandardRaceClassData[] = resultsObj.ResultList.ClassResult.map((el: ClassResult) =>
            new StandardRaceClassData(
                { id: race_id, name: race_name },
                new LtRaceClass(el.Class.Name, el.Class.ShortName),
                [el.PersonResult].flat().map(IofXml3ToLtResult),
                el.Course ? new LtCourse(el.Course.Name, el.Course.NumberOfControls, el.Course.Length, el.Course.Climb) : undefined
                )
            )
            setFilesAndRaceClasses(file, raceClasses, race_id, setFilesState, fileLoaderProps);
        }
    }
    reader.readAsText(file)
}

export function FileLoader(props: FileLoaderProps) {

    const [files, setFiles] = useState<loadedFile[]>([])

    const fileItems = files.map((x) => {
        let classes = "";
        x.data.forEach((c) => {classes += `${c.class.code}, `})
        classes = classes.slice(0,-2);
        return <li key={x.race_id.toString()}><strong>{x.filename}</strong> with <strong>{x.data.length.toString()}</strong> classes: {classes}</li>
    });

    function removeFilesClick() {
        setFiles([]);
        props.setRaceClasses(new Map());
        props.setCompetitionClasses([]);
    }

    function resultsFileParser(file:File) {
        if (file.name.slice(-4) === ".xml") {
            handleXmlfile(file, setFiles, props)
        } else if (file.name.slice(-4) === ".csv") {
            PapaParse<any>(file, {
                header: true,
                dynamicTyping: false,
                complete: (r) => handleCsvFile(r, file, setFiles, props),
                skipEmptyLines: "greedy",
                transform: (value:any, col:any) => {return(value.replace(/\0/g, '').trim())},
                delimitersToGuess: [',', '\t', '|', ';', RECORD_SEP, UNIT_SEP]
            });
        } else {
            alert(`Sorry, ${file.name} is not a supported file type.`);
            console.log(`${file.name} is not supported.`);
        }
    }

    const icon = files.length > 0 ? "check" : "arrow"

    return (
        <Row className="mb-4">
            <WizardSectionTitle title="Load Results File(s)" showLine={false} icon={icon}/>
            
            <Col md={12} lg={5}>
            <p>Add Orienteering Results or Splits files in the <strong>IOF XML v3</strong> format.<br/>Add ScoreO results from Sport Software OE Score in <strong>OESco0012 csv</strong> format.</p>

            <BasicDz parser={resultsFileParser} helpText="Drag and drop files here, or click to open a file browser."/>
            </Col>

            <Col md={12} lg={7}>
            <p><strong>{fileItems.length.toString()}</strong> Loaded file{`${fileItems.length === 1 ? "" : "s"}`}:</p>
            <ul>
                {fileItems}
            </ul>
            {(props.raceClassesByRace.size > 0 ? 
            <Button onClick={()=>removeFilesClick()}
                variant="outline-danger"
                disabled={(props.raceClassesByRace.size > 0 ? false : true)}>
                <FontAwesomeIcon icon={faRotateLeft}/> Start Over - Remove all files and competition classes
            </Button>
            : "" )}
            </Col>
        </Row>
    )
}