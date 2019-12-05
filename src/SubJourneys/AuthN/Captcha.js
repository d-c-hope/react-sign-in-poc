import * as React from "react";

class Captcha extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', isDone: false};
        console.log("error count " + props.errorCount);

        this.onCaptchaDone = props.onCaptchaDone;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props.onCaptchaDone(this.state.value);
        this.setState({isDone:true});
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>Captcha image placeholder</div>
                <label className="captchaLabel">
                    Enter the string above:
                </label>
                <input className="captchaEntry" type="text" name="captcha" value={this.state.value} onChange={this.handleChange} />
                <div className="nextButtonWrapper">
                    <input className="nextButton"type="submit" value="Next" />
                </div>

            </form>
        );
    }
}

export default Captcha;