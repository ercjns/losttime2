import { XMLParser } from "fast-xml-parser";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parse as PapaParse, RECORD_SEP, UNIT_SEP, ParseResult, ParseLocalConfig, LocalFile } from "papaparse"
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


interface FileLoaderProps {
    raceClassesByRace: raceClassesByRace
    setRaceClasses: Function;
    setCompetitionClasses: Function;
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column', // hack fix https://github.com/cssinjs/jss/issues/1344
    alignItems: 'center',
    padding: '20px',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#0d6efd',
    borderStyle: 'dotted',
    backgroundColor: 'white',
    color: '#0d6efd',
    fontStyle: 'italic',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

interface loadedFile {
    filename: string
    data: StandardRaceClassData[]
    race_id: Guid
}

function handleCsvFile(results:ParseResult<any>, file:File, setFilesState:Function, fileLoaderProps:FileLoaderProps) {
    const race_id = Guid.create();
    const race_name = file.name
    
    // detect what type of file this is
    if (results.meta.fields && results.meta.fields[0] === "OESco0012") {
        
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
    } else {
        alert("Sorry, don't support generic CSV files yet. Only OEScore csv files.")
        return
    }
}

export function FileLoader(props: FileLoaderProps) {

    const [files, setFiles] = useState<loadedFile[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            console.log(`got ${file.name}`);
            const reader = new FileReader()

            reader.onabort = () => console.log("file reading aborted");
            reader.onerror = () => console.log("file reader error");
            reader.onload = () => {

                if (file.name.slice(-4) === ".xml") {
                    const parserOptions: any = {
                        ignoreAttributes: false,
                    }
                    const parser = new XMLParser(parserOptions);
                    const resultsObj = parser.parse(reader.result as string);
    
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
    
                    setFiles((existing) => 
                        [...existing, {filename:file.name, data:raceClasses, race_id: race_id}])
    
                    let raceClassesMap:Map<string,StandardRaceClassData> = new Map()
                    raceClasses.forEach((el) =>
                        // without toString() here, a ShortName of 1 ends up as an
                        // integer type key in the map, causing things to break later.
                        raceClassesMap.set(el.class.code.toString(), el))
    
                    props.setRaceClasses((existing: Map<Guid,Map<string,StandardRaceClassData>>) => {
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
                } else if (file.name.slice(-4) === ".csv") {
                    const config:ParseLocalConfig<any, LocalFile> = {
                        header: true,
                        dynamicTyping: false,
                        complete: (r) => handleCsvFile(r,file,setFiles, props),
                        skipEmptyLines: "greedy",
                        transform: (value:any, col:any) => {return(value.replace(/\0/g, '').trim())},
                        delimitersToGuess: [',', '\t', '|', ';', RECORD_SEP, UNIT_SEP]
                    }
                    PapaParse<any>(file, config);
                } else {
                    alert(`Sorry, ${file.name} is not a supported file type.`);
                    console.log(`${file.name} is not supported.`);
                }
            }
            reader.readAsText(file);
        })
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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

    const icon = files.length > 0 ? "check" : "arrow"

    return (
        <Row className="mb-4">
            <WizardSectionTitle title="Load Results File(s)" showLine={false} icon={icon}/>
            
            <Col md={12} lg={5}>
            <p>Add Orienteering Results or Splits files in the <strong>IOF XML v3</strong> format.<br/>Add ScoreO results from Sport Software OE Score in <strong>OESco0012 csv</strong> format.</p>
            <div {...getRootProps({ className: 'dropzone', style: baseStyle })}>
                <input id="dz-file-input" {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop files here...</p> :
                        <p>Drag and drop files here, or click to open a file browser and select files</p>
                }
            </div>
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