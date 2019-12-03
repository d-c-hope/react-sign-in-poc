import * as React from "react";
import TcsRequests from "./TcsRequests";

class Tcs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', isDone: false};
        this.onSubJourneyDone = props.onSubJourneyDone;
        this.requests = new TcsRequests();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({value: event.target.checked});
    }

    handleSubmit(event) {
        if (this.state.value === true) {
            this.requests.postTcs((r) => {
                if (r["tcsDone"] === true) {
                    this.onSubJourneyDone('tcs');
                }
            });

        }
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label className="authnLabel">
                    Accept Terms and Conditions:
                </label>
                <input className="authnEntry" type="checkbox" name="tcs" value={this.state.value} onChange={this.handleChange}/>
                <input className="nextButton" type="submit" value="Submit"/>
            </form>
        );
    }
}

export default Tcs;