import React from 'react';
import { connect } from 'stent/lib/helpers';
import './App.css';

import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import queryString from 'query-string'
import Authn from '../../SubJourneys/AuthN/Authn'
import Tcs from '../../SubJourneys/Tcs/Tcs'
import './App.css';
import {Machine} from "stent/lib";
import {SigninStoredState} from "./SigninStoredState";
import {statesAndTransitions, START, CHECK_IF_DONE, LOADED, ERROR, TCS, AUTHENTICATION, DONE} from './SigninStates';
import Requests from "./Requests";
import {pickNextSubJourney} from "./StatePicker";

let JOURNEYS_MACHINE = "JOURNEYS_MACHINE";

class SigninApp extends React.Component {


  constructor(props) {
    super(props);

    this.storedState = new SigninStoredState("signinstate");
    this.storedState.load();
    this.requests = new Requests(this.storedState);
    this.ptp = ["sky", "gb", "skygo"];

    this.journeysMachine = null;

    this.onSubJourneyDone = this.onSubJourneyDone.bind(this);

    this.state = {
        isLoading: false,
        isComplete: false,
        isError: false,
        needsRedirect: false,
        steps: [],
        subJourney: null,
        error: null
    };
  }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.needsRedirect === true) {
          this.setState({needsRedirect: false});
      }
    }

    componentWillUnmount() {
        this.disconnect();
    }

    componentDidMount() {

      this.journeysMachine = Machine.create(JOURNEYS_MACHINE, {
          state: {name: START},
          transitions: statesAndTransitions
      });

        const searchvalues = queryString.parse(this.props.location.search);
        if ("ptp" in searchvalues) {
            this.ptp = searchvalues["ptp"].split("_");
        }

        this.disconnect = connect()
            .with(JOURNEYS_MACHINE)
            .map((jMachine) => {
                return this.mapMachineStateToComponentState(jMachine)
            });
      // });
      let hasLoaded = this.storedState.hasLoaded();

      if (!hasLoaded) {
          this.journeysMachine.checkIfDone(this.requests, this.storedState);
      }
      else {
          this.journeysMachine.goToLoaded();
      }

  }

  onSubJourneyDone(journeyDone) {
      // can call at the beginning with nothing done where journeyDone is null, then call each time
      // something is complete
      if (journeyDone) {
          this.storedState.addDoneStep(journeyDone);
          this.storedState.store()
      }

      if (this.storedState.hasCompleted()) {
          this.journeysMachine.goToDone();
      }

      let nextJourney = pickNextSubJourney(this.storedState.getStepsDone());
      if (nextJourney === "authn") {
          this.journeysMachine.goToAuthn();
      }
      else if (nextJourney === "tcs") {
          this.journeysMachine.goToTcs();
      }
      else if (nextJourney === "trycomplete") {
          this.journeysMachine.checkIfDone(this.requests, this.storedState);
      }
  }

  mapMachineStateToComponentState(jMachine) {
      console.log("sign in state now " + jMachine.state.name);
      if (jMachine.state.name === CHECK_IF_DONE) {
          this.setState({isLoading: true});
      }
      if (jMachine.state.name === LOADED) {
          this.onSubJourneyDone();
      }
      else if (jMachine.state.name === AUTHENTICATION) {
          this.setState({isLoading: false, subJourney: "Authn", needsRedirect:true});
      }
      else if (jMachine.state.name === TCS) {
          this.setState({isLoading: false, subJourney: "Tcs", needsRedirect:true});
      }
      else if (jMachine.state.name === DONE) {
          this.setState({isLoading: false, subJourney: "Done", needsRedirect:true});
      }
      else if (jMachine.state.name === ERROR) {
          // add a delay so easier to visually see transitions whilst developing. TODO remove
          let r = () => {
              this.setState({isLoading: false, isError: true, needsRedirect:true} );
          };
          setTimeout(r, 3000);
      }
  }

  render() {
      console.log("In the sign-in render " + this.props.location.pathname);

      let redirectPath = this.needsRedirect();
      if (this.state.isLoading === true) {
          return (
              <div className={"journeyWrapper"}>
                <h1>Loading</h1>
              </div>
          );
      }
      else if (redirectPath != null) {
          if (redirectPath === "/complete") {
              window.location.replace("http://localhost:3001/signin/authorize");
              this.setState({subJourney : null});
              return null
          }
          else return (
            <Redirect to={redirectPath}></Redirect>
          );
      }
      else if ((this.state.isError !== true) && (this.state.subJourney== null)) {
          return null;
      }
      else {
          return (
              <div className={"journeyWrapper"}>
                  <Switch>
                      <Route path="/authn">
                          <Authn returnPath="/" pathToLocal={"/authn"} onSubJourneyDone={this.onSubJourneyDone}/>
                      </Route>
                      <Route path="/tcs">
                          <Tcs returnPath="/" pathToLocal={"/tcs"} onSubJourneyDone={this.onSubJourneyDone}/>
                      </Route>
                      <Route path="/complete">
                          <Complete/>
                      </Route>
                      <Route path="/error">
                          <Error/>
                      </Route>
                  </Switch>
              </div>
          );
      }
  }

  needsRedirect() {
      if (this.state.isError === true && this.state.needsRedirect === true) {
          return "/error";
      }
      else if (this.state.subJourney === "Authn" && this.state.needsRedirect === true) {
          return "/authn";
      }
      else if (this.state.subJourney === "Tcs" && this.state.needsRedirect === true) {
          return "/tcs";
      }
      else if (this.state.subJourney === "Done" && this.state.needsRedirect === true) {
          return "/complete";
      }
  }

}


function Error() {
    return <h2>Error</h2>;
}


function Complete() {
  return <h2>Complete</h2>;
}


export default SigninApp;

