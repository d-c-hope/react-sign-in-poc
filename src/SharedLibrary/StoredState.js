


class StoredState {
    constructor(localStorageKey) {
        this.loadedStateObj = null;
        this.storeTime = 0;
        this.localStorageKey = localStorageKey; //"signinstate";
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

}

export default StoredState;
