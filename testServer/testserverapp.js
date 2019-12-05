const Koa = require('koa');
const Http = require('http');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-body')();


// from confluence
// {
//     "NSProfileID" : "36a2f4b",
//     "completedSteps" : ["authn"],
//     "completedJourneys" : ["signin_sky-gb-skygo"],
//     "authnReference" : "4f269a2b4",
//     "prov-ter" : "sky-gb"
// }

const signinSteps = {
    AUTHN: 'authn',
    EMAILVER: 'emailver',
    INVITE: 'invite',
    TCS: 'tcs'
};

const authNSteps = {
    EMAIL: 'email',
    PASSWORD: 'password',
    DONE: 'done'
};

var captchaCounts = {
    "username": 0,
    "password" : 0
}


let signinStepsForPTP = {
    "skygo" : [signinSteps.AUTHN, signinSteps.TCS]
};


let authNStepsForPTP = {
    "skygo" : [authNSteps.PASSWORD]
};

// hardcoded placeholder function
function getStepsOptionFromHeaders(headers) {
    return "skygo";
}

function calcIsComplete(stepsOption, completedSteps) {
    const ptpSteps = signinStepsForPTP[stepsOption]; // steps needed for the ptp
    const filtered = ptpSteps.filter(step => completedSteps.includes(step));

    if (filtered.length == ptpSteps.length) return true;
    else return false;
}

function handleIsComplete(eCookieObj, headers) {

    const completedSteps = eCookieObj.completedSteps;
    let isComplete = calcIsComplete(getStepsOptionFromHeaders(headers), completedSteps);

    eCookieObj['isComplete'] = isComplete;
    return {
            "ret" : {'isComplete' : isComplete, 'completedSteps' : completedSteps},
            "eCookie" : eCookieObj
    }
}

function validateCreds(email, password) {
    if (password == "bbb") {return false}
    else return "45646";
}

// authNMethods: ["password"],
function handlePassword(email, password, eCookieObj, headers) {

    let profileID = validateCreds(email, password);
    if (!profileID) {
        captchaCounts['password'] += 1;
        let r = {
            "ret" : {authNMethods: ["password"], extraState: {}},
            "eCookie" : eCookieObj,
            "status" : 403,
            "captchaNeeded": false,
            "errorCount": captchaCounts['password']
        }
        if (captchaCounts['username'] == 2) ctx.body.captchaNeeded = true;
        return r;
    }
    else {
        eCookieObj['completedAuthN'] = ["password"];
        eCookieObj['email'] = email;
        eCookieObj['nsprofileid'] = profileID;

        const ptpSteps = authNStepsForPTP[getStepsOptionFromHeaders(headers)]; // steps needed for the ptp
        const completedAuthNSteps= eCookieObj.completedAuthN;
        const filtered = ptpSteps.filter(step => completedAuthNSteps.includes(step));
        if (filtered.length == ptpSteps.length) {
            if (! eCookieObj.completedSteps.includes(signinSteps.AUTHN)) {
                eCookieObj['completedSteps'].push(signinSteps.AUTHN);
            }
            // update the authenticaiton context reference for the most recent sign in (in reality we'd store things like authenticaiton time)
            eCookieObj['authReference'] = 34;
        }
        return {
            "ret" : {authNMethods: [authNSteps.DONE], extraState: {}},
            "eCookie" : eCookieObj,
            "status" : 200
        }
    }
}


function handleTcs(tcs, eCookieObj, headers) {

    let profileID = eCookieObj['nsprofileid'];
    let isAuthNDone = eCookieObj.completedSteps.includes(signinSteps.AUTHN);
    if (!profileID || !isAuthNDone) {
        return {
            // Might want to say sign in steps needed still
            "ret" : {tcsDone: false, error: "not signed in", extraState: {}},
            "eCookie" : eCookieObj,
            "status" : 403
        }
    }
    else {

        if (tcs === true) {
            if (! eCookieObj.completedSteps.includes(signinSteps.TCS)) {
                eCookieObj['completedSteps'].push(signinSteps.TCS);
            }
            return {
                "ret" : {tcsDone: true, extraState: {}},
                "eCookie" : eCookieObj,
                "status" : 200
            }
        }
        else {
            return {
                "ret" : {tcsDone: false, error: "must accept", extraState: {}},
                "eCookie" : eCookieObj,
                "status" : 400
            }
        }
    }
}


function handleAuthorize(eCookieObj) {

    const completedSteps = eCookieObj.completedSteps;
    let isComplete = calcIsComplete(getStepsOptionFromHeaders({}), completedSteps);

    if (isComplete) {
        return {
            redirect : "http://skysports.com"//?code=343423 when for real
        };
    }
    else {
        return {
            redirect: "http://localhost:3000/signin"
        }
    }

}

function getECookie(ctx) {
    var eCookieObj = null;
    if (ctx.cookies.get("e-cookie") !== undefined) {
        eCookieObj = decodeCookie(ctx.cookies.get("e-cookie"));
    }
    if ( (eCookieObj == null)  || (Object.keys(eCookieObj).length == 0)) {
        eCookieObj = {'isComplete' : false, 'completedSteps' : []};
    }
    return eCookieObj;
}


function encodeObjAsCookie(obj) {
    return new Buffer(JSON.stringify(obj)).toString("base64");
}

function decodeCookie(cookie) {

    let buff = new Buffer(cookie, 'base64');
    let text = buff.toString('ascii');
    if (text.length == 0) return {};
    let cookieObj = JSON.parse(text);
    return cookieObj;
}

//Receives koa-router as parameter
const Signin = (router) => {

    router.get('/isComplete', (ctx) => {

        var eCookieObj = getECookie(ctx);
        let ret = handleIsComplete(eCookieObj, {});
        console.log("ret is complete", ret);
        let retECookie = encodeObjAsCookie(ret['eCookie']);

        // cookies.set('LastVisit', new Date().toISOString(), { signed: true })
        ctx.cookies.set("e-cookie", retECookie, {});
        ctx.body = ret['ret'];
    });


    router.post('/authn/username', bodyParser, (ctx) => {

        if (ctx.request.body.email == "bbb") {
            captchaCounts['username'] += 1;
            ctx.body = {
                captchaNeeded: false,
                errorCount: captchaCounts['username']
            }
            ctx.status = 403;
            if (captchaCounts['username'] == 2) ctx.body.captchaNeeded = true;
        }
        else {
            ctx.status = 200;
            ctx.body = {
                // In reality should lookup dependent on user type and PTP
                authNMethods: ["password"],
                extraState: {}
            }
        }
    });


    router.post('/authn/password', bodyParser, (ctx) => {

        var eCookieObj = getECookie(ctx);

        let resp = handlePassword(ctx.request.body.email, ctx.request.body.password, eCookieObj, {});

        ctx.status = resp["status"];
        let retECookie = encodeObjAsCookie(resp['eCookie']);
        // cookies.set('LastVisit', new Date().toISOString(), { signed: true })
        ctx.cookies.set("e-cookie", retECookie, {});
        ctx.body = resp['ret'];
    });

    // not complete yet
    router.post('/tcs', bodyParser, (ctx) => {

        var eCookieObj = getECookie(ctx);

        let resp = handleTcs(ctx.request.body.tcs, eCookieObj);

        ctx.status = resp["status"];
        let retECookie = encodeObjAsCookie(resp['eCookie']);
        console.log("tcs post", resp['ret'], " then cookie ",  retECookie);
        ctx.cookies.set("e-cookie", retECookie, {});
        if (ctx.status == 200) {
            ctx.body = resp['ret'];
        }
    });


    router.get('/authorize', bodyParser, (ctx) => {
        var eCookieObj = getECookie(ctx);
        var ret = {"isComplete":false};

        let resp = handleAuthorize(eCookieObj);
        // ctx.body = resp;
        ctx.redirect(resp["redirect"]);

    })
};



const app = new Koa();

// add a delay so easier to visually see transitions whilst developing. TODO remove
app.use(async (ctx, next) => {

    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
    await next();

});
const koaOptions = { credentials: true };
app.use(cors(koaOptions));


// Routes
const signinRouter = new Router({ prefix: '/signin' });
Signin(signinRouter);
app.use(signinRouter.routes());
app.use(bodyParser);


const server = Http.createServer(app.callback());
server.listen(3001);

