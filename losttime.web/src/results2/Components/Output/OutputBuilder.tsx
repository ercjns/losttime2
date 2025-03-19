import { Button, Form, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../../../shared/SectionTitle";
import { CompetitionClass } from "../../CompetitionClass/CompetitionClass";
import { ComputedCompetitionClass } from "../../ComputedCompetitionClass/ComputedCompetitionClass";
import { Guid } from "guid-typescript";
import { EditableTableData } from "./EditableTableData";
import { IndividualScoreMethod } from "../../../results/CompetitionClass";
import { Standard_Time } from "../../CompetitionClass/Variants/Standard_Time";
import { Cascade_SingleSoloWorldCup } from "../../CompetitionClass/Variants/Cascade_SingleSoloWorldCup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { Cascade_SingleSoloScottish1k } from "../../CompetitionClass/Variants/Cascade_SingleSoloScottish1k";
import { useState } from "react";
import { RenderStyles } from "../../Styles/RenderStyles";
import { Standard_Html } from "../../Styles/Standard_Html";
import { Standard_Txt } from "../../Styles/Standard_Txt";
import { RenderStyleWrapper } from "../../Styles/RenderStyleWrapper";
import { Cascade_WordpressHtml } from "../../Styles/Cascade_WordpressHtml";

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

    const [style, setStyle] = useState(RenderStyles.standard_txt.toString())

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
                case IndividualScoreMethod.Points1kScottish.toString():
                    next = new Cascade_SingleSoloScottish1k(old.name, old.contributingResults);
                    break;
                case IndividualScoreMethod.AlphaWithTimes.toString():
                case IndividualScoreMethod.AlphaWithoutTimes.toString():
                case IndividualScoreMethod.PointsOusaAverageWinningTime.toString():
                    console.log("Can't change to that method. Not implemented!")
                    new Error("Can't change to that score method")
                    return;
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

    const styleOptions = Object.keys(RenderStyles)
        .filter((v) => isNaN(Number(v)))
        .map((name) => 
            <option key={`style-option-${name}`} value={RenderStyles[name as keyof typeof RenderStyles]}>{name}</option>
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
        
        let styleHelper:RenderStyleWrapper
        switch (style) {
            case RenderStyles.standard_txt.toString():
                styleHelper = new Standard_Txt(computed)
                break;
            case RenderStyles.standard_html.toString():
                styleHelper = new Standard_Html(computed)
                break;
            case RenderStyles.cascade_wordpresshtml.toString():
                styleHelper = new Cascade_WordpressHtml(computed)
                break;
            default:
                console.log(`Missing style helper for ${style}`)
                return;
        }
        
        const doc = styleHelper.render()

        const date = new Date();
        const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
        const timeString = `${date.getHours().toString().padStart(2,"0")}${date.getMinutes().toString().padStart(2,"0")}`;
        const filename = `${dateString}_${timeString}_results.${styleHelper.extension}`

        downloadFile(doc, filename);
    }

    return <Row>
        <SectionTitle title="3. Build Output" line={true} />
        
        <Form className="mb-2">
            <p>
            <Form.Label>Output Style</Form.Label>
            <Form.Select
                aria-label="output style"
                onChange={({target:{value}}) => setStyle(value)}
                defaultValue={style}>
                {styleOptions}
            </Form.Select>
            </p>
            <p>
            <Button onClick={()=>computeAndDownloadClick()}>
                Compute and Download
            </Button>
            </p>
        </Form>

        <h4>Competition Classes</h4>
        <div>
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
        </div>


    </Row>
}