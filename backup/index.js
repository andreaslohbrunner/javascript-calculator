import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

//use of ReactDOM.render because root.render causes errors in passing the test
ReactDOM.render(<App />,  document.getElementById("root"));