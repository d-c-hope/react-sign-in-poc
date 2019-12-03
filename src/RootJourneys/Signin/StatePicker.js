import {sky} from './JourneyConfig.js';

function pickNextSubJourney(stepsDone) {

    let stepsToDo = sky.journeyComposition.signin;
    let filtered = stepsToDo.filter((step) => {
        if (stepsDone.includes(step)) return false;
        else return true;
    });

    if (filtered.length === 0) return "trycomplete";
    else return filtered[0];

}


export {pickNextSubJourney};