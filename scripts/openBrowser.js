const open = require('open');

(async () => {

    // Opens the url in the default browser
    await open('http://localhost:3000/signin?ptp=sky_gb_skygo', {app: ['google chrome']});

    // // Specify the app to open in
    // await open('https://sindresorhus.com', {app: 'firefox'});
    //
    // // Specify app arguments
    // await open('https://sindresorhus.com', {app: ['google chrome', '--incognito']});
})();