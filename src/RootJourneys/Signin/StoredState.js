
const signinSteps = {
    AUTHN: 'authn',
    EMAILVER: 'emailver',
    INVITE: 'invite',
    TCS: 'tcs'
};


class StoredState {
    constructor() {
        //{'isComplete' : false, 'completedSteps' : []}
        this.loadedStateObj = null;
        this.storeTime = 0;
        this.localStorageKey = "signinstate";
    }

    // Could alternatively use a cookie
    load() {

        // let ls = localStorage.getItem(key);
        try {
            let ls = localStorage.getItem(this.localStorageKey);
            let lsObj = JSON.parse(ls);
            this.storeTime = lsObj.storeTime;
            this.loadedStateObj = lsObj.data;
        }
        catch(err) {
        }
    }

    updateAndStore(data) {
        if (this.loadedStateObj === null) {
            this.loadedStateObj = data;
        }
        else {
            const keys = Object.keys(data);
            for (const key of keys) {
                this.loadedStateObj[key] = data[key];
            }
        }
        this.store();
    }

    store() {
        var d = new Date();
        var n = d.getTime(); //ms since epoch
        localStorage.setItem(this.localStorageKey, JSON.stringify({'storeTime': n, 'data': this.loadedStateObj}));
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

export {signinSteps, StoredState};