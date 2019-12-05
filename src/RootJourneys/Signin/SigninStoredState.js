import StoredState from "../../SharedLibrary/StoredState";

const signinSteps = {
    AUTHN: 'authn',
    EMAILVER: 'emailver',
    INVITE: 'invite',
    TCS: 'tcs'
};
// let n  = new StoredState.js();

class SigninStoredState extends StoredState {
    constructor(localStorageKey) {
        super(localStorageKey);
        //{'isComplete' : false, 'completedSteps' : []}
        this.loadedStateObj = null;
        this.storeTime = 0;
        this.localStorageKey = "signinstate";
    }

    hasCompleted() {
        // let isComplete = 'isComplete' in this.loadedStateObj;
        if (this.loadedStateObj['isComplete'] === true) return true;
    }

    getStepsDone() {
        let steps = 'completedSteps' in this.loadedStateObj;
        if (steps) return this.loadedStateObj['completedSteps'];
        else return [];
    }

    hasDoneAuthN() {
        let steps = this.getStepsDone();
        if (steps.includes(signinSteps.AUTHN)) return true;
        else return false;
    }

    hasLoaded() {
        if (this.loadedStateObj !== null) return true;
        else return false;
    }

    addDoneStep(stepName) {
        this.loadedStateObj.completedSteps.push(stepName);
    }

}

export {signinSteps, SigninStoredState};