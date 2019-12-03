import React from 'react';
import ReactDOM from 'react-dom';
import SigninApp from './SigninApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SigninApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
