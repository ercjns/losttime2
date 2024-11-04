import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Col, Container} from 'react-bootstrap';
import { Header } from './shared/Header';
import { EntryProcessor } from './entries/EntryProcessor';
import { ResultsBuilder } from './results/ResultsBuilder';
import { Landing } from './info/Landing';
import { Footer } from './shared/Footer';
import { Documentation } from './info/Documentation';


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
                <Landing />
              </Route>
              <Route path="/entries">
                <EntryProcessor />
              </Route>
              <Redirect from="/registrations" to="/entries" />
              <Route path="/results">
                <ResultsBuilder />
              </Route>
              <Route path="/docs">
                <Documentation />
              </Route>
              <Redirect from="/documentation" to="/docs" />
            </Switch>
            <Footer />
          </Col>
      </Container>
    </div>
  );
}

export default App;
