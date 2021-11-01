import React from 'react';
import { ltEvent } from '../../lt/Event';
import { ltEventClassSingleRace } from '../../lt/EventClassSingleRace';


type RaceDetailsFormProps = {
    event: ltEvent
}

type RaceDetailsFormState = {
    error: Error|null,
    isLoaded: Boolean,
    races: ltEventClassSingleRace[]
}

export class RaceDetailsForm extends React.Component<RaceDetailsFormProps, RaceDetailsFormState, {}> {

    constructor(props:RaceDetailsFormProps) {
        super(props);
        this.state = {
            error: null,
            isLoaded:false, 
            races:[]
        };
    }

    getRaceClasses() {
        fetch('/api/events/' + this.props.event.id + '/classes')
        .then((res) => res.json())
        .then((result) => {
            this.setState({
                races:result, 
                isLoaded:true
            });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error:error
            });
        });
    }

    componentDidMount() {
        this.getRaceClasses();
    }

    render () {
    const {error, isLoaded, races} = this.state;
    if (error) {
        return (<div>Error: {error.message}</div>)
    } else if (!isLoaded) {
        return(<div>Loading...</div>)
    } else {
        return (
            <div>
                <ul>
                    <li>Name: {this.props.event.name}</li>
                    <li>Key: {this.props.event.api_key}</li>
                </ul>
                <p>Classes</p>
                <ul>
                    {races.map(race => (
                    <li key={race.eventclass_id}>
                        {race.name},{race.scoring}
                    </li>
                ))}
                </ul>
            </div>
        );
    }
    }
}