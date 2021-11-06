import React from 'react';
import { ltEvent } from '../../lt/Event';
import { filledRaceResult, ltEventClassSingleRace } from '../../lt/EventClassSingleRace';


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

    // get other results data here? currently plan to collect it all here, but may want to pass that off to child components later.

    componentDidMount() {
        this.getRaceClasses();
    }

    formatTimeMMMSS(seconds:number) {
        if (!seconds) {
            return "";
        }
        const m = Math.floor(seconds / 60).toString();
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    compareResults(a:filledRaceResult, b:filledRaceResult) {
        if (a.entry.competitive && b.entry.competitive) {
            if (a.result.finish_status === 'OK' && b.result.finish_status === 'OK') {
                if (a.time && b.time) {
                    if (a.time < b.time) {
                        return -1; // lower time is faster, order first
                    } 
                    else if (a.time > b.time) {
                        return 1;
                    } 
                    else {
                        return 0;
                    }
                }
                // never expect to hit cases with ok status but no time:
                else if (a.time) {
                    return -1;
                }
                else if (b.time) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (a.result.finish_status === 'OK') {
                return -1;
            }
            else if (b.result.finish_status === 'OK') {
                return 1;
            }
            else {
                return 0;
            }
        }
        else if (a.entry.competitive) {
            return -1;
        }
        else if (b.entry.competitive) {
            return 1;
        }
        else {
            return 0;
        }
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
                    <li>Event Name: {this.props.event.name}</li>
                    <li>Event Key: {this.props.event.api_key}</li>
                </ul>
                <p>Classes</p>
                {races.map(race => (
                    <div>
                    <h3>{race.name} ({race.name_short})</h3>
                    <table>
                        <tr>
                            <th>Pos.</th>
                            <th>Name</th>
                            <th>Club</th>
                            <th>Time</th>
                            <th>Score</th>
                        </tr>
                        {race.raceresults.sort(this.compareResults).map((result, index, array) => {

                            var pos = '';
                            var score = '';
                            
                            if (result.result.finish_status !== 'OK') {
                                pos = '';
                            } else if (index === 0 || this.compareResults(result, array[index-1]) !== 0) {
                                // first or different from previous, add 1 to convert index to position
                                pos = (index+1).toString()
                            } else {
                                for (var i = index-1; i >= 0; i--) {
                                    // look backwards until front of array, or find a value that is not equal
                                    if (i === 0) {
                                        pos = (i+1).toString();
                                        break;
                                    }
                                    if (this.compareResults(result, array[i]) !== 0) {
                                        // when find index of non-equal item, step forward 1,
                                        // then add 1 to convert index to position.
                                        pos = (i+1+1).toString()+'tie';
                                        break;
                                    }
                                }
                            }

                            if (pos === '') {
                                score = '';
                            } else if (pos === '1') {
                                score = '100';
                            } else if (pos === '2') {
                                score = '95';
                            } else if (pos === '3') {
                                score = '92';
                            } else {
                                score = (94 - parseInt(pos)).toString()
                            }
                            
                            var timestring = this.formatTimeMMMSS(result.time)

                            if (result.result.finish_status !== 'OK') {
                                timestring += ` (${result.result.finish_status})`;
                            } 
                            return(
                                <tr>
                                    <td>{pos}</td>
                                    <td>{result.entry.person}</td>
                                    <td>{result.entry.club}</td>
                                    <td>{timestring}</td>
                                    <td>{score}</td>
                                </tr>
                            )
                        })}
                    </table>
                    </div>
                ))}
            </div>
        );
    }
    }
}