import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Col, Container} from 'react-bootstrap';
import { Header } from './components/Header';
import { EntryProcessor } from './components/PreEvent/EntryProcessor';
import { ResultsBuilder } from './components/PostEvent/ResultsBuilder';


function App() {
  return (
    <div className="App">
      <Container fluid style={{
        backgroundColor: '#F7F7F7',
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: '100vh'
      }}>
        <Header />
          <Col xs={{span:10, offset:1}}>
            <Switch>
              <Route exact path="/">
                {/* <EntryProcessor /> */}
                <ResultsBuilder />
              </Route>
              <Route path="/registrations">
                <EntryProcessor />
              </Route>
              <Route path="/results">
                <ResultsBuilder />
              </Route>
            </Switch>
          </Col>
      </Container>
    </div>
  );
}

export default App;
