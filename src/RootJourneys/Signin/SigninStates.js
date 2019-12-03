import { call } from 'stent/lib/helpers';

const START = 'START';
const FETCHING = 'FETCHING';
const LOADED = 'LOADED';
const ERROR = 'ERROR';
const TCS = 'TCS';
const AUTHENTICATION = 'AUTHENTICATION';
const DONE = 'DONE';


function * fetch(machine, requests, storedState) {
    yield FETCHING;

    try {
        const res = yield call(requests.fetchIsComplete);
        storedState.updateAndStore(res);

        return {'name': LOADED, isCompleteRes: res};
    } catch (error) {
        return ERROR;
    }
}

const statesAndTransitions = {

    START: {
        'fetch': fetch,
        'go to loaded' : {name: LOADED}
    },
    FETCHING: {
        'go to loaded': {name: LOADED},
    },
    LOADED : {
        'go to authn': {name: AUTHENTICATION},
        'go to tcs': {name: TCS},
        'go to nearly done' : fetch,
        'go to done' : {name: DONE},
    },
    ERROR : {
        'done': null
    },
    AUTHENTICATION: {
        'go to tcs': {name: TCS},
        'go to nearly done' : fetch

    },
    TCS: {
        'go to nearly done' : fetch,
    },
    DONE: {
        'done': null
    }
};

export {statesAndTransitions, START, FETCHING, LOADED, ERROR, TCS, AUTHENTICATION, DONE};
