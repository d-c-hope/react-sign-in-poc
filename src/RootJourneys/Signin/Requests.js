import axios from "axios";

const isCompleteAPI = "http://localhost:3001/signin/isComplete";

class Requests {

    constructor(storedState) {
        // super(props);
        this.storedState = storedState;
    }


    async fetchIsComplete() {

            const res = await axios.get(isCompleteAPI, {withCredentials: true});
            return res.data;
    }
}

export default Requests;

