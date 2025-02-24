import { XMLParser } from "fast-xml-parser";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";
import { ClassResult } from "../../shared/orienteeringtypes/IofResultXml";

interface FileLoaderProps {
    setRaceClasses: Function;
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    // flexDirection: 'column',
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


export function FileLoader(props: FileLoaderProps) {

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
                let raceClassesMap = new Map()
                raceClasses.forEach((el) =>
                    raceClassesMap.set(el.xmlClass.ShortName ?? el.xmlClass.Name, el))

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

    return (
        <div>
            This is the File Loader.
            This is responsible for taking input files from the user and delivering RaceClasses to the CompetitionClassComposer.
            <div {...getRootProps({ className: 'dropzone', style: baseStyle })}>
                <input id="dz-file-input" {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop files here...</p> :
                        <p>Drag and drop files here, or click to select files</p>
                }
            </div>
        </div>
    )
}