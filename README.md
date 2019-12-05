# React sign-in proof of concept

# Introduction
This repo contains a react proof of concept using React JS with Stent to drive a journey with a Stent state machine
It shows how a journey (signing in is used as the example) maybe be made up of a number of sub-journeys that can easily be configured

Note that the aim of the PoC is to prove out the journey control and state transitions, both the server and frontend code is very rough
There is no production setup
The frontend was setup using the create-react-app tool

## Running the proof of concept
There are two parts to the proof of concept:
 * the test server
 * the web app

For the test server you should run 

 * `cd test`
 * `yarn install`  
 * `node testserverapp.js` 

and for the web app:
 * `yarn install`  
 * `yarn start` 


Open [http://localhost:3000/signin](http://localhost:3000/signin) to view the sign-in app in the browser.
In order to go through a simulated OAuth journey go to [http://localhost:3001/signin/authorize](http://localhost:3001/authorize)
Note that after entering T&Cs the app will redirect back to /authorize and if the journey is complete the browser will 
redirect to an external site


## Importing into intellij
You may need to delete the .idea directory as it is missing the .iml file expected in the .idea file

# Other

## Delays
The test server has 3 second delays on requests in order to better see transitions on the routes

## Use of Stent
Stent is not used with the Redux style React adapter than is provided. Rather the change in state of Stent is used to trigger a state change on the component and thus a re-render

## Cookies
The e-cookie value is intended to show the payload that would go in an encrypted cookie
However, note that it is not encrypted for this PoC, it is just encoded

## Unfinished parts
Everything is fairly rough but some key features not yet implemented include:
 * Some of the configuration that should be driven off the ptp header is currently hardcoded
 * Captcha always succeeds - no fake backend to validate it like email, password etc
 * No captcha on password fails yet on frontend