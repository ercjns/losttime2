import React from 'react';
import { ltEvent } from '../../lt/Event';


type RaceDetailsFormProps = {
    event: ltEvent
}

export class RaceDetailsForm extends React.Component<RaceDetailsFormProps, {}, {}> {

    render () {
    return (
        <div>
            <ul>
                <li>Name: {this.props.event.name}</li>
                <li>Key: {this.props.event.api_key}</li>
            </ul>
        </div>
    );
    }
}