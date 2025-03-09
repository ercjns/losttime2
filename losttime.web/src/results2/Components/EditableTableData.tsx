import { MouseEvent, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap";

interface editableTableDataProps {
    data:string
    onSave:Function
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

    if (editing) {
        return <td>
            <InputGroup>
            <Form>
                <Form.Control size="sm" type="text" value={value} onChange={({target:{value}}) => setValue(value)} />
            </Form>
            <Button
            size='sm'
            onClick={()=>handleSave()}>save</Button>
            </InputGroup>
            </td>
    }
    return <td>
        {props.data} <a href="#" onClick={(e)=>handleEdit(e)}>edit</a>
        </td>
}