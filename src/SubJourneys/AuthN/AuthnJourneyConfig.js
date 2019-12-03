
class AuthN {
    steps = ["username", "password"];
    captcha = true;
}

class AuthNSky extends AuthN {

}

let authnConfigs = {
    "sky" : AuthNSky
};


export {authnConfigs};


















