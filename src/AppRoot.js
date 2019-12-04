import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import './RootJourneys/Signin/App.css';
import SigninApp from "./RootJourneys/Signin/SigninApp";


class AppRoot extends React.Component {

  render(props) {

    return (
        <Router basename='/signin'>
          <div>
              <Route path="/" render = {(routeProps) => <SigninApp {...routeProps}></SigninApp>} />

          </div>
        </Router>
    );
  }
}


export default AppRoot;