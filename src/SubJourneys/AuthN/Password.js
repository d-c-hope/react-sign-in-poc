import * as React from "react";

class Password extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props.onPassword(this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label className="authnLabel">
                    Password:
                </label>
                <input className="authnEntry" type="text" name="password" value={this.state.value} onChange={this.handleChange}/>
                <div className="nextButtonWrapper">
                    <input className="nextButton" type="submit" value="Submit"/>
                </div>
            </form>
        );
    }
}

export default Password;