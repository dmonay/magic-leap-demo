import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import JQuery from 'jquery';

import App from 'components/App';
import { initializeState } from 'lib/state/state.js';

// load vendor SCSS and static assets
import 'bootstrap/dist/css/bootstrap.min.css';
window.$ = window.jQuery = JQuery;
require('../assets/3d/pod_racer.mtl');
require('../assets/3d/pod_racer.obj');

// Load app SCSS
import '../scss/app.scss';

// Render DOM
const elem = document.getElementById('anakin-app');

if (elem) {
  const store = initializeState();
  if (store) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      elem
    );
  }
}
