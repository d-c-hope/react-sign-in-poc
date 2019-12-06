import axios from "axios";

const usernameAPI = "http://localhost:3001/signin/authn/username";
const passwordAPI = "http://localhost:3001/signin/authn/password";


class Requests {

    // constructor(storedState) {
    //     this.storedState = storedState;
    // }

    postUsername(email, callback) {

        axios.post(usernameAPI, {'email': email}, {withCredentials: true})
            .then(function (response) {
                console.log("Email post success");
                let res = response.data;
                // let state = getNextSteps(res.authNMethods, res.extraState);
                let r = {
                    'success': true, 'email': email, authNMethods: res.authNMethods,
                    extraState: res.extraState
                };
                callback(r)
            })
            .catch(function (error) {
                console.log("Email post error");
                if (! error) callback({'success': false, 'email': email, 'unknown': true});
                let res = error.response.data;
                if (res.captchaNeeded) {
                    let r = {'success': false, 'email': email, "captcha": true};
                    callback(r);
                } else {
                    let r = {'success': false, 'email': email, errorCount: res.errorCount};
                    callback(r);
                }
            });
    }


    async postPassword(email, password) {
        const res = await axios.post(passwordAPI, {'email': email, 'password': password}, {withCredentials: true});
        return res.data;
    }


    getCaptcha(captchaRef) {
        let p = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve('randomstring');
            }, 1000);
        });
        return p;

    }

    postCaptcha(captchaRef, captchaVal) {
        let p = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve({'success' : true});
            }, 1000);
        });
        return p;
    }

}

export default Requests;

