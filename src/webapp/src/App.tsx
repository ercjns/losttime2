import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import { Col, Container} from 'react-bootstrap';
import { Header } from './components/Header';
import {EntryProcessor} from './components/adminentries/EntryProcessor';
import { ResultsProcessor } from './components/adminresults/ResultsProcessor';
import { Results } from './components/results/Results';


function App() {
  return (
    <div className="App">
      <Container fluid style={{
        backgroundColor: '#F7F7F7',
        paddingLeft: 0,
        paddingRight: 0,
      }}>
        <Header />
          <Col xs={{span:10, offset:1}}>
            <Switch>
              <Route exact path="/">
                <Results />
              </Route>
              <Route path="/registrations">
                <EntryProcessor />
              </Route>
              <Route path="/results">
                <ResultsProcessor />
              </Route>
            </Switch>
          </Col>
      </Container>
    </div>
  );
}

export default App;
