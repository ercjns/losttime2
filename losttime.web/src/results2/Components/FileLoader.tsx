import { XMLParser } from "fast-xml-parser";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parse as PapaParse, RECORD_SEP, UNIT_SEP, ParseResult, ParseLocalConfig, LocalFile } from "papaparse"
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { ClassResult, IofXml3ToLtResult } from "../../shared/orienteeringtypes/IofResultXml";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { WizardSectionTitle } from "../../shared/WizardSectionTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPlus, faRotateLeft, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { OESco0012, OEScoCsvToLtScoreOResult } from "../../shared/orienteeringtypes/OESco0012";
import { LtRaceClass } from "../../shared/orienteeringtypes/LtRaceClass";
import { LtCourse } from "../../shared/orienteeringtypes/LtCourse";
import { PlaceholderRaceClassAdder } from "./PlaceholderRaceClassAdder";

export type RaceResultsData = {
    id:Guid,
    name:string
    filename:string
    raceClasses:Map<string,StandardRaceClassData>
}

interface FileLoaderProps {
    raceResultsData: RaceResultsData[]
    setRaceResultsData: Function;
    setCompetitionClasses: Function;
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column', // hack fix https://github.com/cssinjs/jss/issues/1344
    alignItems: 'center',
    marginBottom: '1rem',
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

function handleCsvFile(results:ParseResult<any>, file:File, fileLoaderProps:FileLoaderProps) {
    const race_id = Guid.create();
    const race_name = file.name
    
    // detect what type of file this is
    if (results.meta.fields && results.meta.fields[0] === "OESco0012") {
        
        let newRaceResultsData:RaceResultsData = {
            id: race_id,
            name: race_name,
            filename: file.name,
            raceClasses: new Map()
        }

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
                {id:race_id, name:race_name},
                classInfo,
                results.data.filter((x:OESco0012) => x.Short===classInfo.code).map(OEScoCsvToLtScoreOResult)
        ))

        raceClasses.forEach((el) =>
            // without toString() here, a ShortName of 1 ends up as an
            // integer type key in the map, causing things to break later.
            newRaceResultsData.raceClasses.set(el.class.code.toString(), el)
        )

        fileLoaderProps.setRaceResultsData((existing: RaceResultsData[]) => {
            return [...existing,newRaceResultsData]
        })
    } else {
        alert("Sorry, don't support generic CSV files yet. Only OEScore csv files.")
        return
    }
}

export function FileLoader(props: FileLoaderProps) {

    const [fileLoaderAlert, setFileLoaderAlert] = useState({isVisible:false, body:""})

    function handleResultFileUp(id:Guid) {
        const idx = props.raceResultsData.findIndex((x) => x.id === id)
        const swapWith = idx - 1;
        if (idx > -1 && idx < props.raceResultsData.length && swapWith > -1) {
            const A = props.raceResultsData.at(idx)!
            const B = props.raceResultsData.at(swapWith)!
            props.raceResultsData.splice(swapWith, 2, A, B)
            props.setRaceResultsData([...props.raceResultsData])
        }
    }

    function handleResultFileDown(id:Guid) {
        const idx = props.raceResultsData.findIndex((x) => x.id === id)
        const swapWith = idx + 1;
        if (idx > -1 && swapWith < props.raceResultsData.length && swapWith > -1) {
            const A = props.raceResultsData.at(idx)!
            const B = props.raceResultsData.at(swapWith)!
            props.raceResultsData.splice(idx, 2, B, A)
            props.setRaceResultsData([...props.raceResultsData])
        }
    }

    function handleResultFileDelete(id:Guid) {
        props.setRaceResultsData([...props.raceResultsData.filter((x)=>x.id !== id)])
    }

    function handleAddClass(id:Guid, classCode:string) {
        const indx = props.raceResultsData.findIndex((x) => x.id === id)
        if (indx > -1) {
            props.raceResultsData[indx].raceClasses.set(classCode, new StandardRaceClassData(
                {id: props.raceResultsData[indx].id, name: props.raceResultsData[indx].name},
                {name: `Placeholder`, code: classCode},
                []
            ));
            props.setRaceResultsData([...props.raceResultsData])
        }
    }

    function removeFilesClick() {
        props.setRaceResultsData([]);
        props.setCompetitionClasses([]);
    }

    function addPlaceholderWithClassesClick() {
        const race_id = Guid.create()
        const race_name = 'placeholder'
        const knownRaceClasses = props.raceResultsData[props.raceResultsData.length-1].raceClasses
        const newRaceClasses: Map<string,StandardRaceClassData> = new Map()
        knownRaceClasses.forEach((v,k) => {
            newRaceClasses.set(v.class.code.toString(), {
                id: Guid.create(),
                race_id: race_id,
                race_name: race_name,
                class: v.class,
                results: []
            });
        });
        props.setRaceResultsData([...props.raceResultsData, {
            id: race_id,
            name: race_name,
            filename: race_name,
            raceClasses: newRaceClasses
        }])
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            setFileLoaderAlert({isVisible:false, body:""});
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

                    if (!resultsObj.ResultList) {
                        setFileLoaderAlert({isVisible:true, body:"No ResultsList in this xml file."})
                        return;
                    }

                    if (!resultsObj.ResultList.Event) {
                        setFileLoaderAlert({isVisible:true, body:"No Event in this ResultList xml file."})
                        return;
                    }

                    const race_name = resultsObj.ResultList.Event.Name

                    // init empty - allows for files with no results
                    let raceClasses: StandardRaceClassData[] = []
                    if (resultsObj.ResultList.ClassResult !== undefined) {
                        // uses [possibly-not-an-array].flat() to ensure we have an array here so we can map()
                        raceClasses = [resultsObj.ResultList.ClassResult].flat().map((el: ClassResult) =>
                            new StandardRaceClassData(
                                { id: race_id, name: race_name},
                                new LtRaceClass(el.Class.Name, el.Class.ShortName ?? el.Class.Name),
                                [el.PersonResult].flat().map(IofXml3ToLtResult),
                                el.Course ? new LtCourse(el.Course.Name, el.Course.NumberOfControls, el.Course.Length, el.Course.Climb) : undefined
                            )
                        )
                    }
    
                    let raceClassesMap:Map<string,StandardRaceClassData> = new Map()
                    raceClasses.forEach((el) => {
                        // without toString() here, a ShortName of 1 ends up as an
                        // integer type key in the map, causing things to break later.
                        
                        // code (ShortName) does not exist if this is splits by course. Fallback to class name.
                        if (el.class.code === undefined) {
                            return raceClassesMap.set(el.class.name.toString(), el)
                        }
                        return raceClassesMap.set(el.class.code.toString(), el)
                    });
                        

                    const newRaceResultsData:RaceResultsData = {
                        id: race_id,
                        name: race_name,
                        filename: file.name,
                        raceClasses: raceClassesMap
                    }
    
                    props.setRaceResultsData((existing: RaceResultsData[]) => {
                        return [...existing,newRaceResultsData]
                    })
                    
                } else if (file.name.slice(-4) === ".csv") {
                    const config:ParseLocalConfig<any, LocalFile> = {
                        header: true,
                        dynamicTyping: false,
                        complete: (r) => handleCsvFile(r,file,props),
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
    }, [props]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const loadedFileRows = props.raceResultsData.map((x, idx) => {
        let classes = "";
        x.raceClasses.forEach((c) => {classes += `${c.class.code}, `})
        classes = classes.slice(0,-2);
        return <tr key={x.id.toString()}>
            <td>{idx+1}</td>
            <td>{x.name}</td>
            <td style={{wordBreak:"break-all"}}>{x.filename}</td>
            <td>
                {classes}&nbsp;
                <PlaceholderRaceClassAdder
                    classCode=""
                    onSave={(value:string) => handleAddClass(x.id, value)}
                />
            </td>
            <td valign="middle" style={{whiteSpace:"nowrap"}}>
                <Button variant='outline-dark' size='sm' onClick={()=>handleResultFileUp(x.id)} title="move up"><FontAwesomeIcon icon={faArrowUp}/></Button>&nbsp;
                <Button variant='outline-dark' size='sm' onClick={()=>handleResultFileDown(x.id)} title="move down"><FontAwesomeIcon icon={faArrowDown}/></Button>&nbsp;
                <Button variant='outline-danger' size='sm' onClick={()=>handleResultFileDelete(x.id)} title="remove"><FontAwesomeIcon icon={faTrashAlt}/></Button>
                
            </td>
        </tr>
    })

    const icon = props.raceResultsData.length > 0 ? "check" : "arrow"

    return (
        <Row className="mb-4">
            <WizardSectionTitle title="Load Results File(s)" showLine={false} icon={icon}/>
            
            <Col md={12} lg={4}>
            <Alert variant="danger" show={fileLoaderAlert.isVisible} onClose={() => setFileLoaderAlert({isVisible:false, body:""})} dismissible>
                <Alert.Heading as='h5'>File not loaded.</Alert.Heading>
                <p style={{marginBottom:'0'}}>{fileLoaderAlert.body}</p>
            </Alert>
            <p>Add Orienteering Results or Splits files in the <strong>IOF XML v3</strong> format.<br/>Add ScoreO results from Sport Software OE Score in <strong>OESco0012 csv</strong> format.</p>
            <div {...getRootProps({ className: 'dropzone', style: baseStyle })}>
                <input id="dz-file-input" {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop files here...</p> :
                        <p>Drag and drop files here, or click to open a file browser and select files</p>
                }
            </div>
            <Button onClick={()=>addPlaceholderWithClassesClick()}
                variant="outline-secondary">
                <FontAwesomeIcon icon={faPlus}/> Add a placeholder file
            </Button>
            </Col>

            <Col md={12} lg={8}>
            <p><strong>{loadedFileRows.length.toString()}</strong> Loaded file{`${loadedFileRows.length === 1 ? "" : "s"}`}.
            &nbsp;
            {(props.raceResultsData.length > 0 ? 
            <Button onClick={()=>removeFilesClick()}
                variant="outline-danger"
                disabled={(props.raceResultsData.length > 0 ? false : true)}>
                <FontAwesomeIcon icon={faRotateLeft}/> Start Over - Remove all files and competition classes
            </Button>
            : "" )}
            </p>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Event Name</th>
                        <th>File Name</th>
                        <th>Classes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loadedFileRows}
                </tbody>
            </Table>
            </Col>
        </Row>
    )
}