import { StandardRaceClassData } from "../StandardRaceClassData";
import { Guid } from "guid-typescript";

interface CompetitionClassComposerProps {
    raceClassesByRace:Map<Guid,Map<string,StandardRaceClassData>>;
}

export function CompetitionClassComposer(props:CompetitionClassComposerProps) {
    
    // goal: create a table with a column for each race and a row for each class
    // raceClasses is totally flat right now.
    // get the list of unique races
    // (sort them?)
    // this is my column headers
    // get the list of unique classes
    // (sort them?)
    // this is my row labels
    // find the record that exists at this intersection, there might not be one.
    // present this data
    // expect to end up with a component with props that is the StandardRaceClassData


    const allRaceClasses = 
        [...props.raceClassesByRace].map(([raceid,raceClasses]) =>
            [...raceClasses].map(([shortName,raceClass]) =>
                // be SURE that everything in the JSX element is string
                // if it's not, you'll get an error about invalid JSX array
                // without keys or something. That's not the issue.
                <li key={raceClass.id.toString()}> {raceid.toString()} {shortName} {raceClass.xmlPersonResults.length.toString()} </li>
            )
        ).flat();

    // let races:{raceid:Guid,name:string}[] = [];
    // props.raceClassesByRace.forEach((el) => 
    //     races.push({
    //         raceid: el.values().next().value!.race_id,
    //         name: el.values().next().value!.race_name
    //     })
    // );

    // const columnHeaders = races.map((el) =>
    //     <th key={el.raceid.toString()}>{el.name}</th>
    // )


    return (
        <div>
        This is the Competition Class Composer.
        This is responsible for:
        <ul>
            <li>Displaying available RaceClasses for user to build into a competition class</li>
            <li>(or allowing a user to use a pre-set to define competition classes)</li>
            <li>Allowing the user to specify the kind of output they desire</li>
            <li>Computing results for each defined competition class and delivering the output</li>
        </ul>
        If this is too much for one component, it can and should be split up!
        <ol>
            {allRaceClasses}
        </ol>

        <table>
            <thead>
            <tr>
                <th>Classes</th>
                {/* {columnHeaders} */}
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
            
        </table>
        </div>
    )
}