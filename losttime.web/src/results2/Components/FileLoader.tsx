import { XMLParser } from "fast-xml-parser";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { ClassResult } from "../../shared/orienteeringtypes/IofResultXml";
import { Button, Col, Row } from "react-bootstrap";
import { WizardSectionTitle } from "../../shared/WizardSectionTitle";
import { raceClassesByRace } from "./Compose/CompetitionClassComposer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

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

export function FileLoader(props: FileLoaderProps) {

    const [files, setFiles] = useState<loadedFile[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            console.log(`got ${file.name}`);
            const reader = new FileReader()

            reader.onabort = () => console.log("file reading aborted");
            reader.onerror = () => console.log("file reader error");
            reader.onload = () => {
                const parserOptions: any = {
                    ignoreAttributes: false,
                }
                const parser = new XMLParser(parserOptions);
                const resultsObj = parser.parse(reader.result as string);

                const race_id = Guid.create();
                const race_name = resultsObj.ResultList.Event.Name

                const raceClasses: StandardRaceClassData[] = resultsObj.ResultList.ClassResult.map((el: ClassResult) =>
                    new StandardRaceClassData({ id: race_id, name: race_name }, el)
                )

                setFiles((existing) => 
                    [...existing, {filename:file.name, data:raceClasses, race_id: race_id}])

                let raceClassesMap:Map<string,StandardRaceClassData> = new Map()
                raceClasses.forEach((el) =>
                    // without toString() here, a ShortName of 1 ends up as an
                    // integer type key in the map, causing things to break later.
                    raceClassesMap.set(el.xmlClass.ShortName.toString(), el))

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
            }
            reader.readAsText(file);
        })
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const fileItems = files.map((x) => {
        let classes = "";
        x.data.forEach((c) =>
            classes += `${c.xmlClass.ShortName}, `
        )
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
            <p>Add Orienteering Results or Splits files in the <strong>IOF XML v3</strong> format.</p>
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