import React from 'react';
import { PageTitle } from '../PageTitle';
import { ltEvent } from '../../lt/Event';
import { Button } from 'react-bootstrap';

type resultspagestate = {
    error: Error|null,
    isLoaded: Boolean
    events: ltEvent[]
  }


export class Results extends React.Component<{}, resultspagestate, {}> {

    constructor(props:{}) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            events: []
        }
    }

    getEvents() {
        fetch('/api/events')
        .then(res => res.json())
        .then((result) => {
            this.setState({
                events: result,
                isLoaded: true
            });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error:error
            });
        }
        )
    }


    componentDidMount() {
        this.getEvents();
    }

    render () {
    const {error, isLoaded } = this.state;
    if (error) {
        return (<div>Error: {error.message}</div>)
    } else if (!isLoaded) {
        return(<div>Loading...</div>)
    } else {
        return (
            <div>
                <PageTitle 
                    title="Lost Time Orienteering"
                />
                <p>
                    <Button href="/registrations">Process Registrations</Button>
                    <Button href="/results">Process Results</Button>
                </p>
                {/* <p>
                    Events
                </p> */}
                {/* <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            {event.name}
                        </li>
                    ))}
                </ul> */}
            </div>
        );
    }
    }
}