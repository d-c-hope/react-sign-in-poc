import axios from "axios";

const tcsAPI = "http://localhost:3001/signin/tcs";


class TcsRequests {

    async postTcs(onSuccess) {
        const res = axios.post(tcsAPI, {'tcs': true},
            {withCredentials: true}).
        then(function(response) {
            onSuccess(response.data);
        }).catch(function(error) {

        });
    }

}


export default TcsRequests;

