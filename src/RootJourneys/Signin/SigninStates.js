import { call } from 'stent/lib/helpers';

const START = 'START';
const CHECK_IF_DONE = 'CHECK_IF_DONE';
const LOADED = 'LOADED';
const ERROR = 'ERROR';
const TCS = 'TCS';
const AUTHENTICATION = 'AUTHENTICATION';
const DONE = 'DONE';


function * fetchIsComplete(machine, requests, storedState) {
    yield CHECK_IF_DONE;

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
        'check if done': fetchIsComplete,
        'go to loaded' : {name: LOADED}
    },
    CHECK_IF_DONE: {
        'go to loaded': {name: LOADED},
    },
    LOADED : {
        'go to authn': {name: AUTHENTICATION},
        'go to tcs': {name: TCS},
        'check if done' : fetchIsComplete,
        'go to done' : {name: DONE},
    },
    ERROR : {
        'done': null
    },
    AUTHENTICATION: {
        'go to tcs': {name: TCS},
        'check if done' : fetchIsComplete

    },
    TCS: {
        'check if done' : fetchIsComplete,
    },
    DONE: {
        'done': null
    }
};

export {statesAndTransitions, START, CHECK_IF_DONE, LOADED, ERROR, TCS, AUTHENTICATION, DONE};
