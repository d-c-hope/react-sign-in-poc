# React sign-in proof of concept

# Introduction
This repo contains a react proof of concept using React JS with Stent to drive a journey with a Stent state machine
It shows how a journey (signing in is used as the example) maybe be made up of a number of sub-journeys that can easily be configured

Note that the aim of the POC is to prove out the journey control and state transitions, both the server and frontend code is very rough
There is no production setup
The frontend was setup using the create-react-app tool

## Running the proof
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


Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Importing into intellij
You may need to delete the .idea directory as it is missing the .iml file expected in the .idea file