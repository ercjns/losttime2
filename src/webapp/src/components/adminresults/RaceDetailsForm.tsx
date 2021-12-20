import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ltEvent } from '../../lt/Event';
import { filledRaceResult, ltEventClassSingleRace, singleTeamResult } from '../../lt/EventClassSingleRace';
import { Button } from 'react-bootstrap';


type RaceDetailsFormProps = {
    event: ltEvent
}

type RaceDetailsFormState = {
    error: Error|null,
    isLoaded: Boolean,
    races: ltEventClassSingleRace[]
}

type ResultsByTeam = {
    [key:string] : filledRaceResult[]
}

const SCORE_METHODS_WITH_SCORE = ['WorldCup'];

class RaceClassResultTable extends React.Component<ltEventClassSingleRace, {}, {}> {
    constructor(props:ltEventClassSingleRace) {
        super(props);
    }

    formatTimeString(result:filledRaceResult) {
        var res = '';
        if (result.result.finish_status === 'MissingPunch') {
            res += ' msp'
        } else if (result.result.finish_status === 'DidNotFinish') {
            res += ' dnf'
        } else if (result.result.finish_status === 'NotCompeting') {
            res += ' nc'
        } else if (result.result.finish_status === 'OverTime') {
            res += ' ovt'
        } else if (result.result.finish_status === 'Disqualified') {
            res += ' DQ'
        }
        res += ' ' + this.formatTimeMMMSS(result.time)
        return res
    }

    formatTimeMMMSS(seconds:number) {
        if (!seconds) {
            return "--:--";
        }
        const m = Math.floor(seconds / 60).toString();
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    render() {

        const race = this.props;

        const displayScoreColumn = SCORE_METHODS_WITH_SCORE.includes(race.race_scoring);


        return(
        <div>
        <h3 id={race.name_short}>{race.name}</h3>
        <table id={'ResultsTable-'+race.name_short} className='table table-striped'>
            <thead>
            <tr id='column-titles'>
                <th>Pos.</th>
                <th>Name</th>
                <th>Club</th>
                <th className='text-right'>Time</th>
                {displayScoreColumn?<th className='text-right'>Score</th>:''}
            </tr>
            </thead>
            <tbody>
            {race.raceresults.map(result => {
                return(
                    <tr>
                        <td>{result.pos?.toString()}</td>
                        <td>{result.entry.person}</td>
                        <td>{result.entry.club}</td>
                        <td className='text-right'>{this.formatTimeString(result)}</td>
                        {displayScoreColumn?<td className='text-right'>{result.score?.toString()}</td>:''}
                    </tr>
                )})
            }
            </tbody>
        </table>
        </div>
        )
    }

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

    getRaceClasses = () => {
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

    compareResults = (a:filledRaceResult, b:filledRaceResult) => {
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

    compareScoreHelper = (a:number|undefined|null, b:number|undefined|null) => {
        if (!(a == null) && !(b == null)) {return (b - a);}
        else if (a) {return -1;}
        else if (b) {return 1;}
        else {return 0}
    }

    compareTeamResults = (a:singleTeamResult, b:singleTeamResult) => {
        if (a.score !== b.score) {
            return (b.score - a.score);
        } else {
            const first = this.compareScoreHelper(a.results[0].score, b.results[0].score);
            if (first !== 0) {
                return (first);
            }
            const second = this.compareScoreHelper(a.results[1]?.score, b.results[1]?.score);
            if (second !== 0) {
                return (second);
            }
            return this.compareScoreHelper(a.results[2]?.score, b.results[2]?.score);
        }
    }

    compareResultsByScore = (a:filledRaceResult, b:filledRaceResult) => {
        return this.compareScoreHelper(a.score, b.score)
    }

    combineResultsForEventClasses = (eventresults:ltEventClassSingleRace[]) => {
        const neweventresults = eventresults.reduce<ltEventClassSingleRace[]>((acc, result) => {
            if (!acc.some(el => el.eventclass_id === result.eventclass_id)) {
                acc.push(result)
            } else {
                const toadd = acc.findIndex(el => el.eventclass_id === result.eventclass_id)
                acc[toadd].raceresults.push(...result.raceresults)
            }
            return acc
        }, [])
        return neweventresults
    }

    buildTeams = (results:filledRaceResult[]) => {
        const resultsByTeam = results.reduce<ResultsByTeam>((acc, result) => {
            if (!acc[result.entry.club]) {
                acc[result.entry.club] = []
            }
            acc[result.entry.club].push(result)
            return acc;
        }, {} as ResultsByTeam)

        var res:singleTeamResult[] = []
        Object.entries(resultsByTeam).forEach(team => {
            const [club, results] = team;
            const top = results.sort(this.compareResultsByScore).slice(0,3);
            res.push({
                club: club,
                score: top.reduce<number>((prev, result) => {if(result.score === undefined) {return(prev)} return (prev+result.score)}, 0),
                results: top
            });
        })
        return(res)
    }

    assignIndvScores = (results:filledRaceResult[]) => {
        results
            .filter(result=>result.result.finish_status==='OK' && result.entry.competitive)
            .sort(this.compareResults)
            .map((result, index, array) => {
               
                if (result.result.finish_status !== 'OK') {
                    result.pos = undefined
                } else if (index === 0 || this.compareResults(result, array[index-1]) !== 0) {
                    // first or different from previous, add 1 to convert index to position
                    result.pos = (index+1)
                } else {
                    for (var i = index-1; i >= 0; i--) {
                        // look backwards until front of array, or find a value that is not equal
                        if (i === 0) {
                            result.pos = (i+1)
                            break;
                        }
                        if (this.compareResults(result, array[i]) !== 0) {
                            // when find index of non-equal item, step forward 1,
                            // then add 1 to convert index to position.
                            result.pos = (i+1+1)
                            break;
                        }
                    }
                }

                if (result.pos === undefined) {
                    result.score = undefined;
                } else if (result.pos === 1) {
                    result.score = 100;
                } else if (result.pos === 2) {
                    result.score = 95;
                } else if (result.pos === 3) {
                    result.score = 92;
                } else {
                    result.score = (94 - result.pos)
                }

                return(result);
            })

        results.filter(result=>result.result.finish_status==='MissingPunch' || result.result.finish_status==='DidNotFinish')
            .map(res =>{
                res.score = 0
                return(res);
            })
        return(results);
    }

    assignTeamScores = (teamresults:singleTeamResult[]) => {
        teamresults
            .sort(this.compareTeamResults)
            .map((result, index, array) => {
                if (index === 0 || this.compareTeamResults(result, array[index-1]) !== 0) {
                    result.pos = (index+1)
                } else {
                    for (var i = index-1; i >= 0; i--) {
                        // look backwards until front of array, or find a value that is not equal
                        if (i === 0) {
                            result.pos = (i+1)
                            break;
                        }
                        if (this.compareTeamResults(result, array[i]) !== 0) {
                            // when find index of non-equal item, step forward 1,
                            // then add 1 to convert index to position.
                            result.pos = (i+1+1)
                            break;
                        }
                    }
                }

                return(result);
            })
        
        return(teamresults);
    }
    
    copycode() {
        navigator.clipboard.writeText(document.getElementById("raw-results-html")!.innerText)
    }

    render () {

    const {error, isLoaded, races} = this.state;

    races.filter(race=>race.event_scoring==='RaceScoring')
        .forEach(race => {race.raceresults = this.assignIndvScores(race.raceresults)});

    const indvClasses = races
        .filter(race=>race.event_scoring==='RaceScoring')
        .map(race => (<RaceClassResultTable {...race}/>));
    
    races.filter(race=>race.event_scoring==='WIOLTeams')
        .forEach(race => {
            race.raceresults = this.assignIndvScores(race.raceresults).filter(res => res.score !== undefined);
        }
    );

    const teamClassesToProcess = this.combineResultsForEventClasses(races.filter(race=>race.event_scoring==='WIOLTeams'))
    
    teamClassesToProcess.forEach(race => {
        race.teamresults = this.assignTeamScores(this.buildTeams(race.raceresults))
    });

    const teamClasses = teamClassesToProcess.map(race => (
        <div>
        <h3>{race.name}</h3>
        <table>
            <thead>
            <tr>
                <th>Pos.</th>
                <th>Name</th>
                <th>Club</th>
                <th>Score</th>
            </tr>
            </thead>
            <tbody>
            {race.teamresults?.map(result => {
                return(
                    <React.Fragment>
                    <tr>
                        <td>{result.pos}</td>
                        <td>{result.club}</td>
                        <td>{result.club}</td>
                        <td>{result.score}</td>
                    </tr>
                    {result.results.map(result => {
                        return(
                            <tr>
                                <td></td>
                                <td>{result.entry.person}</td>
                                <td>{result.entry.club}</td>
                                <td>{result.score}</td>
                            </tr>
                        )
                    })}
                    </React.Fragment>
                )
            })}
            </tbody>
        </table>
        </div>
    ))

    let resultsRaw = '';
    console.log(resultsRaw);
    console.log(indvClasses.length);
    for (let i = 0; i < indvClasses.length; i++) {
        const rawhtml = ReactDOMServer.renderToStaticMarkup(indvClasses[i])
            .replaceAll(/\s*([<>:;&#=])\s*/g, '$1')
            .replaceAll(/></g, '>\n<');
        console.log(rawhtml);
        resultsRaw = resultsRaw + rawhtml;
        console.log(resultsRaw);
    }

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

                <hr/>

                <pre style={{maxHeight:'150px'}} id="raw-results-html">
                    {resultsRaw}
                </pre>
                
                <Button
                    onClick={this.copycode}>
                    Copy HTML to my clipboard
                </Button>

                <hr/>

                {indvClasses}

                {teamClasses}


            </div>
        );
    }
    }
}