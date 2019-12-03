import axios from "axios";

const usernameAPI = "http://localhost:3001/signin/authn/username";
const passwordAPI = "http://localhost:3001/signin/authn/password";


class Requests {

    constructor(storedState) {
        this.storedState = storedState;
    }

    async postUsername(email) {
            const res = await axios.post(usernameAPI, {'email': email}, {withCredentials: true});
            return res.data;
    }

    async postPassword(email, password) {
        const res = await axios.post(passwordAPI, {'email': email, 'password': password}, {withCredentials: true});
        return res.data;
    }
}

export default Requests;

