import React from 'react';
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import {
    withRouter
} from "react-router";
import {Machine} from "stent/lib";
import {statesAndTransitions, START, USERNAME, POSTING_USERNAME, PASSWORD, POSTING_PASSWORD, ERROR, DONE} from './AuthnStates';
import Username from './Username';
import Password from './Password';
import Requests from "./AuthnRequests";
import {connect} from "stent/lib/helpers";


let AUTHN_MACHINE = "AUTHN_MACHINE";

class Authn extends React.Component {

    constructor(props) {
        super(props);

        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.requests = new Requests(null);
        this.email = null;
        this.onSubJourneyDone = props.onSubJourneyDone;

        this.state = {
            isLoading: false,
            isComplete: false,
            isError: false,
            needsRedirect: false,
            subJourney: null,
            uErrorCount: 0
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

        this.authnMachine = Machine.create(AUTHN_MACHINE, {
            state: {name: START},
            transitions: statesAndTransitions
        });

        this.disconnect = connect()
            .with(AUTHN_MACHINE)
            .map((aMachine) => {
                if (aMachine.name !== AUTHN_MACHINE) return null;
                return this.mapMachineStateToComponentState(aMachine);
            });

        this.authnMachine.goToUsername();

    }

    mapMachineStateToComponentState(aMachine) {

        if (this.state.needsRedirect === true) return null;
        var goBackMachineState = null;
        if (this.state.subJourney == "Username") {
            goBackMachineState = "USERNAME"
        }

        console.log("authn state now " + aMachine.state.name + "needs redirect" + this.state.needsRedirect);
        if (aMachine.state.name === POSTING_USERNAME) {
            this.setState({isLoading: true});
        }
        else if (aMachine.state.name === POSTING_PASSWORD) {
            this.setState({isLoading: true});
        }
        else if (aMachine.state.name === USERNAME) {
            this.setState({isLoading: false, subJourney: "Username", needsRedirect:true, uErrorCount: aMachine.state.errorCount});
        }
        else if (aMachine.state.name === PASSWORD) {
            this.email = this.state.email;
            this.setState({isLoading: false, subJourney: "Password", needsRedirect:true});
        }
        else if (aMachine.state.name === DONE) {
            this.onSubJourneyDone('authn');
        }
        else if (aMachine.state.name === ERROR) {
            let r = () => {this.setState({isLoading: false, isError: true, needsRedirect:true} );};
            setTimeout(r, 3000);
        }
        return null;
    }


    onUsername(email) {
        this.authnMachine.goToPostingUsername(this.requests, email);
    }

    onPassword(password) {
        this.authnMachine.goToPostingPassword(this.requests, this.email, password);
    }

    render() {
        let path = this.props.pathToLocal;
        let returnPath = this.props.returnPath;

        console.log("In the auth render: " + path);

        if (this.state.isLoading === true) {
            return (
                <h1>Loading</h1>
            );
        }
        let redirectPath = this.needsDirect(path, returnPath);
        if (redirectPath !== null) {
            return (
                <Redirect to={redirectPath}></Redirect>
            );
        }
        else {
            return (
                <div>
                    <h1>Sign In</h1>
                    <Switch>
                        <Route path={`${path}/username`}>
                            <Username onUsername={this.onUsername} errorCount={this.state.uErrorCount}/>
                        </Route>
                        <Route path={`${path}/password`}>
                            <Password onPassword={this.onPassword}/>
                        </Route>
                        <Route path={`${path}/error`}>
                            <Error props={this.props.location}/>
                        </Route>
                    </Switch>
                </div>
            );
        }
    }


    needsDirect(path, returnPath) {
        if (this.state.isComplete === true) {
            return returnPath;
        }
        else if (this.state.isError === true && this.state.needsRedirect === true) {
            return path + "/error";
        }
        else if (this.state.subJourney === "Username" && this.state.needsRedirect === true) {
            return path + "/username";
        }
        else if (this.state.subJourney === "Password" && this.state.needsRedirect === true) {
            return path + "/password";
        }
        else {
            return null;
        }
    }
}

function Error() {
    return <h2>Error</h2>;
}

export default withRouter(Authn);

