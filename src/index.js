import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import 'antd-mobile/dist/antd-mobile.css';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));


serviceWorker.unregister();
