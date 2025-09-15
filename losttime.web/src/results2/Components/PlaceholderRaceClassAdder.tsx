import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap";

// TODO: This is largely a copy of EditableTableData - ideally they merge

interface placeholderRaceClassAdderProps {
    classCode:string
    onSave:Function
}

export function PlaceholderRaceClassAdder(props:placeholderRaceClassAdderProps) {

    const [editing, setEditing] = useState(false);
    const [classCode, setClassCode] = useState(props.classCode)

    function handleEdit(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) {
        e.preventDefault();
        setEditing(true);
    }
    
    function handleSave() {
        props.onSave(classCode)
        setClassCode("")
        setEditing(false)
    }

    function handleCancel() {
        setClassCode("")
        setEditing(false)
    }

    if (!editing) {
        //eslint-disable-next-line
        return <a className="link-secondary" onClick={(e)=>handleEdit(e)} title="add empty class"><FontAwesomeIcon icon={faSquarePlus}/></a>
    } else {
        return <InputGroup>
                    <Form>
                        <Form.Control 
                            size="sm" 
                            type="text" 
                            value={classCode}
                            placeholder="class code"
                            onChange={({target:{value}}) => setClassCode(value)} 
                        />
                    </Form>
                    <Button
                    size='sm'
                    variant="outline-secondary"
                    onClick={()=>handleCancel()}>cancel</Button>
                    <Button
                    size='sm'
                    variant="outline-primary"
                    disabled={classCode.length<1}
                    onClick={()=>handleSave()}>save</Button>
                </InputGroup>
    }
}