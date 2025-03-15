import { Button, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";
import { CompetitionClass } from "../CompetitionClass";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass";
import { Guid } from "guid-typescript";
import { EditableTableData } from "./EditableTableData";
import { IndividualScoreMethod } from "../../results/CompetitionClass";
import { Standard_Time } from "../CompetitionClassDefinitionVariants/Standard_Time";
import { Cascade_SingleSoloWorldCup } from "../CompetitionClassDefinitionVariants/Cascade_SingleSoloWorldCup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

interface outputBuilderProps {
    competitionClasses:CompetitionClass[]
    setCompetitionClasses:Function
}

function downloadFile(data:any, name = "file.txt") {
    const blob = new Blob([data], {type:"octet-stream"});
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href,
      style: "display-none",
      download: name
    });
    document.body.appendChild(a);

    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  }

export function OutputBuilder(props:outputBuilderProps) {

    function handleCompetitionClassDelete(id:Guid) {
        props.setCompetitionClasses([...props.competitionClasses.filter((x) => x.id !== id)])
    }

    function handleCompetitionClassUp(id:Guid) {
        const idx = props.competitionClasses.findIndex((x) => x.id === id)
        const swapWith = idx - 1;
        if (idx > -1 && idx < props.competitionClasses.length && swapWith > -1) {
            const A = props.competitionClasses.at(idx)!
            const B = props.competitionClasses.at(swapWith)!
            props.competitionClasses.splice(swapWith, 2, A, B)
            props.setCompetitionClasses([...props.competitionClasses])
        }
    }

    function handleCompetitionClassDown(id:Guid) {
        const idx = props.competitionClasses.findIndex((x) => x.id === id)
        const swapWith = idx + 1;
        if (idx > -1 && swapWith < props.competitionClasses.length && swapWith > -1) {
            const A = props.competitionClasses.at(idx)!
            const B = props.competitionClasses.at(swapWith)!
            props.competitionClasses.splice(idx, 2, B, A)
            props.setCompetitionClasses([...props.competitionClasses])
        }
    }

    function handleCompetitionClassRename(id:Guid, name:string) {
        const idx = props.competitionClasses.findIndex((x) => x.id === id)
        if (idx > -1) {
            props.competitionClasses.at(idx)!.name = name;
            props.setCompetitionClasses([...props.competitionClasses])
        }
    }

    function handleScoreMethodChange(id:Guid, scoreMethod:string) {
        const idx = props.competitionClasses.findIndex((x) => x.id === id)
        if (idx > -1) {
            const old = props.competitionClasses.at(idx)!;
            if (old.scoreMethodEnumValue.toString() === scoreMethod) {
                return;
            }
            let next:CompetitionClass
            switch (scoreMethod) {
                case IndividualScoreMethod.Time.toString():
                    next = new Standard_Time(old.name, old.contributingResults);
                    break;
                case IndividualScoreMethod.PointsCocWorldCup.toString():
                    next = new Cascade_SingleSoloWorldCup(old.name, old.contributingResults);
                    break;
                default:
                    new Error("Can't change to that score method")
                    return;
            }

            props.competitionClasses.splice(idx,1,next)
            props.setCompetitionClasses([...props.competitionClasses])
        }
        
    }

    const scoreMethodOptions = Object.keys(IndividualScoreMethod)
            .filter((v) => isNaN(Number(v)))
            .map((name) =>
                <option key={`${name}-score-method-option`} value={IndividualScoreMethod[name as keyof typeof IndividualScoreMethod]}>{name}</option>
        );

    const rows = props.competitionClasses.map((x) => {
        const names = x.contributingNames();
        let namesConcat = "";
        names.forEach(n =>
            namesConcat += `${n.class} (${n.race}), `
        )
        namesConcat = namesConcat.slice(0,-2);

        return <tr key={x.id.toString()}>
            <EditableTableData 
                data={x.name}
                type="string" 
                onSave={(value:string) => handleCompetitionClassRename(x.id, value)}/>
            <EditableTableData 
                data={x.scoreMethodFriendly()}
                type="option"
                options={scoreMethodOptions}
                defaultOption={x.scoreMethodEnumValue().toString()}
                onSave={(value:string) => handleScoreMethodChange(x.id, value)}/>
            <td valign="middle">
                <Button variant='outline-dark' size='sm' onClick={()=>handleCompetitionClassUp(x.id)} title="move up"><FontAwesomeIcon icon={faArrowUp}/></Button>&nbsp;
                <Button variant='outline-dark' size='sm' onClick={()=>handleCompetitionClassDown(x.id)} title="move down"><FontAwesomeIcon icon={faArrowDown}/></Button>&nbsp;
                <Button variant='outline-danger' size='sm' onClick={()=>handleCompetitionClassDelete(x.id)} title="remove"><FontAwesomeIcon icon={faTrashAlt}/></Button>
            </td>
            <td valign="middle">{x.contributingResultsFlat().length.toString()}</td>
            <td valign="middle">{namesConcat}</td>
        </tr>
    })



    function computeAndDownloadClick() {
        const computed:ComputedCompetitionClass[] = []
        props.competitionClasses.forEach((c) =>
            computed.push(c.compute()));
        let doc = "";
        computed.forEach((c) =>
            doc += c.render_txt());
        const date = new Date();
        const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
        const timeString = `${date.getHours().toString().padStart(2,"0")}${date.getMinutes().toString().padStart(2,"0")}`;
        const filename = `${dateString}_${timeString}_results.txt`

        downloadFile(doc, filename);
    }

    return <Row>
        <SectionTitle title="3. Build Output" line={true} />
        <h4>Competition Classes</h4>
        <Table striped size="sm">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score Method</th>
                    <th>Actions</th>
                    <th>Participants</th>
                    <th>Contributing Data</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>

        <p>(select output format)</p>

        <Button
            onClick={()=>computeAndDownloadClick()}
        >Compute and Download</Button>
    </Row>
}