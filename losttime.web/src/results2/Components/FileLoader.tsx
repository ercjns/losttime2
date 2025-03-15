import { XMLParser } from "fast-xml-parser";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { ClassResult } from "../../shared/orienteeringtypes/IofResultXml";
import { SectionTitle } from "../../shared/SectionTitle";
import { Col, Row } from "react-bootstrap";

interface FileLoaderProps {
    setRaceClasses: Function;
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column', // hack fix https://github.com/cssinjs/jss/issues/1344
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'magenta',
    borderStyle: 'dashed',
    backgroundColor: 'lightgrey',
    color: 'black',
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
    }
        
    )

    return (
        <Row className="mb-4">
            <SectionTitle title="1. Load Results File(s)" line={true} />
            
            <Col md={12} lg={5}>
            <p>Add Orienteering Results or Splits files in the IOF XML v3 format.</p>
            <div {...getRootProps({ className: 'dropzone', style: baseStyle })}>
                <input id="dz-file-input" {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop files here...</p> :
                        <p>Drag and drop files here, or click to select files</p>
                }
            </div>
            </Col>

            <Col md={12} lg={7}>
            <p><strong>{fileItems.length.toString()}</strong> Loaded file{`${fileItems.length === 1 ? "" : "s"}`}:</p>
            <ul>
                {fileItems}
            </ul>
            </Col>
        </Row>
    )
}