import * as React from "react";

class Username extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', isDone: false};
        console.log("error count " + props.errorCount);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props.onUsername(this.state.value);
        this.setState({isDone:true});
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label className="authnLabel">
                    Email:
                </label>
                <input className="authnEntry" type="text" name="email" value={this.state.value} onChange={this.handleChange} />
                <div className="nextButtonWrapper">
                    <input className="nextButton"type="submit" value="Next" />
                </div>
                <p>{this.props.errorCount ? 'Error count: ' + this.props.errorCount : ''}</p>

            </form>
        );
    }
}

export default Username;