import { call } from 'stent/lib/helpers';

const START = 'START';
const USERNAME = 'USERNAME';
const POSTING_USERNAME = 'POSTING_USERNAME';
const PASSWORD = 'PASSWORD';
const POSTING_PASSWORD = 'POSTING_PASSWORD';
const USERNAME_CAPTCHA = 'USERNAME_CAPTCHA';
const PASSWORD_CAPTCHA = 'PASSWORD_CAPTCHA';
const ERROR = 'ERROR';
const DONE = 'DONE';


function getNextSteps(authnmethods, extraState) {

    if (authnmethods.includes("password")) return PASSWORD;
    else if (authnmethods.includes("done")) return DONE;
    else return ERROR;
}


function * postUser(machine, requests, email) {
    yield {name: POSTING_USERNAME, email: email} ;

}


function * postPassword(machine, requests, email, password) {
    yield POSTING_PASSWORD;

    try {
        const res = yield call(requests.postPassword, email, password);
        return getNextSteps(res.authNMethods, res.extraState);
    } catch (error) {
        console.log("Error: " + error);
        return machine.goToPasswordError();
    }

}


const statesAndTransitions = {

    START: {
        'go to username' : {name: USERNAME}
    },
    USERNAME: {
        'go to posting username': postUser,
    },
    POSTING_USERNAME : {
        'go to password': {name: PASSWORD},
        'go to username': function(machine, errorCount) {return {name: USERNAME, errorCount: errorCount}},
        'go to error' : {name: USERNAME},
        'go to username captcha' : function(_, cID) {return {name: USERNAME_CAPTCHA, captchaRef: cID};}
    },
    PASSWORD : {
        'go to posting password': postPassword
    },
    POSTING_PASSWORD : {
        'go to done' : {name: DONE},
        'go to password error': {name: PASSWORD, failure: true},
        'go to password captcha' : function(_, cID) {return {name: PASSWORD_CAPTCHA, captchaRef: cID};}
    },
    USERNAME_CAPTCHA : {
        'go to username' : {name: USERNAME},
    },
    PASSWORD_CAPTCHA : {
        'go to password': {name: PASSWORD},
    },
    DONE: {
        'done': null
    }
};

export {statesAndTransitions, getNextSteps, START, USERNAME,
    POSTING_USERNAME, PASSWORD, POSTING_PASSWORD, USERNAME_CAPTCHA,
    PASSWORD_CAPTCHA, ERROR, DONE};
