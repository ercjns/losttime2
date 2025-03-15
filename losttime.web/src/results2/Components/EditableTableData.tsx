import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap";

interface editableTableDataProps {
    data:string|number
    onSave:Function
    type: "string" | "option"
    options?: JSX.Element[]
    defaultOption?: string
}

export function EditableTableData(props:editableTableDataProps) {

    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.data)

    function handleEdit(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) {
        e.preventDefault();
        setEditing(true);
    }

    function handleSave() {
        props.onSave(value)
        setEditing(false)
    }

    function handleCancel() {
        setValue(props.data)
        setEditing(false)
    }

    if (editing && props.type === "string") {
        return <td>
            <InputGroup>
            <Form>
                <Form.Control size="sm" type="text" value={value} onChange={({target:{value}}) => setValue(value)} />
            </Form>
            <Button
            size='sm'
            variant="outline-secondary"
            onClick={()=>handleCancel()}>cancel</Button>
            <Button
            size='sm'
            variant="outline-primary"
            onClick={()=>handleSave()}>save</Button>
            </InputGroup>
            </td>
    } else if (editing && props.type === "option") {
        return <td>
        <InputGroup>
        <Form>
            <Form.Select
                size="sm"
                aria-label="score method"
                onChange={({target:{value}}) => setValue(value)}
                defaultValue={props.defaultOption}>
                    {props.options}
            </Form.Select>
            </Form>
            <Button
            size='sm'
            variant="outline-secondary"
            onClick={()=>handleCancel()}>cancel</Button>
            <Button
            size='sm'
            variant="outline-primary"
            onClick={()=>handleSave()}>save</Button>
        </InputGroup>
        </td>
    }
    return <td valign="middle">
        {props.data} <a href="#" onClick={(e)=>handleEdit(e)} title="edit"><FontAwesomeIcon icon={faPenToSquare}/></a>
        </td>
}