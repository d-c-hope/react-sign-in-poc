import { call } from 'stent/lib/helpers';

const START = 'START';
const USERNAME = 'USERNAME';
const POSTING_USERNAME = 'POSTING_USERNAME';
const PASSWORD = 'PASSWORD';
const POSTING_PASSWORD = 'POSTING_PASSWORD';
const CAPTCHA = 'CAPTCHA';
const ERROR = 'ERROR';
const USERNAME_ERROR = 'USERNAME_ERROR';
const PASSWORD_ERROR = 'PASSWORD_ERROR';
const DONE = 'DONE';


function getNextSteps(authnmethods, extraState) {

    if (authnmethods.includes("password")) return PASSWORD;
    else if (authnmethods.includes("done")) return DONE;
    else return ERROR;
}


function * postUser(machine, requests, email) {
    yield POSTING_USERNAME;

    try {
        const res = yield call(requests.postUsername, email);
        let state = getNextSteps(res.authNMethods, res.extraState);
        return {'name': state, 'email':email};
    } catch (error) {
        console.log("Error: " + error);
        if (error.response.data.errorCount > 3) {
            return {name: 'CAPTCHA', };
        }
        else {
            return {name: 'USERNAME', errorCount: error.response.data.errorCount};
        }

    }
}


function * postPassword(machine, requests, email, password) {
    yield POSTING_PASSWORD;

    try {
        const res = yield call(requests.postPassword, email, password);
        return getNextSteps(res.authNMethods, res.extraState);
    } catch (error) {
        console.log("Error: " + error);
        return ERROR;
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
        //'go to username error': function(errorCount) {return {name: USERNAME, failureCount: errorCount}},
        'go to error' : {name: USERNAME},
        'go to captcha' : {name: CAPTCHA, returnPath: USERNAME}
    },
    PASSWORD : {
        'go to posting password': postPassword
    },
    POSTING_PASSWORD : {
        'go to done' : {name: DONE},
        'go to password error': {name: PASSWORD, failure: true},
        'go to captcha' : {name: CAPTCHA, returnPath: PASSWORD}
    },
    // USERNAME_ERROR : {
    //     'done': null,
    //     'go to username' : {name: USERNAME},
    // },
    // PASSWORD_ERROR : {
    //     'done': null,
    //     'go to password': {name: PASSWORD},
    // },
    CAPTCHA : {
        'done': null,
        'go to username' : {name: USERNAME},
        'go to password': {name: PASSWORD},
    },
    DONE: {
        'done': null
    }
};

export {statesAndTransitions, START, USERNAME, POSTING_USERNAME, PASSWORD, POSTING_PASSWORD, CAPTCHA, ERROR, DONE};
