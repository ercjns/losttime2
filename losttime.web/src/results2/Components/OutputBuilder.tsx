import { Button, Row, Table } from "react-bootstrap";
import { SectionTitle } from "../../shared/SectionTitle";
import { CompetitionClass } from "../CompetitionClass";
import { ComputedCompetitionClass } from "../ComputedCompetitionClass";

interface outputBuilderProps {
    competitionClasses:CompetitionClass[]
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

    const rows = props.competitionClasses.map((x) => {
        const names = x.contributingNames();
        let namesConcat = "";
        names.forEach(n =>
            namesConcat += `${n.class} (${n.race}), `
        )
        namesConcat = namesConcat.slice(0,-2);

        return <tr key={x.id.toString()}>
            <td>{x.name} (edit)</td>
            <td>{x.contributingResultsFlat().length.toString()}</td>
            <td>Winner???</td>
            <td>{x.scoreMethodFriendly()} (edit)</td>
            <td>{namesConcat}</td>
            <td>(up)(down)(trash)</td>
        </tr>
    })

    function computeAndDownloadClick() {
        const computed:ComputedCompetitionClass[] = []
        props.competitionClasses.forEach((c) =>
            computed.push(c.compute()));
        let doc = "";
        computed.forEach((c) =>
            doc += c.render_html());
        const date = new Date();
        const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
        const timeString = `${date.getHours().toString().padStart(2,"0")}${date.getMinutes().toString().padStart(2,"0")}`;
        const filename = `${dateString}_${timeString}_results.html`

        downloadFile(doc, filename);
    }

    return <Row>
        <SectionTitle title="3. Build Output" line={true} />
        <h4>Competition Classes</h4>
        <Table striped size="sm">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Participants</td>
                    <td>Winner</td>
                    <td>Score Method</td>
                    <td>Contributing Data</td>
                    <td>Actions</td>
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