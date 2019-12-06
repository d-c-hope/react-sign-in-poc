import * as React from "react";
import Requests from './AuthnRequests';

class Captcha extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', isDone: false, imageLoaded: false};
        this.captchaRef = this.props.captchaRef;
        console.log("error count " + props.errorCount);

        this.onCaptchaDone = props.onCaptchaDone;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.requests = new Requests();

    }

    componentDidMount() {
        let outerThis = this;
        this.requests.getCaptcha().then(function(){
            outerThis.setState({'imageLoaded': true});
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        let outerThis = this;
        this.requests.postCaptcha(this.captchaRef).then(function(res){
            if (res.success && res.success === true) {
                outerThis.props.onCaptchaDone(outerThis.state.value);
                outerThis.setState({isDone: true});
            }
        });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div> { this.state.imageLoaded ? "image placeholder" : "" } </div>
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