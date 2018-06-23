import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import Edit from './components/Edit';
import Create from './components/Create';
import Show from './components/Show';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path='/' component={App} />
            <Route exact path='/edit/:id' component={Edit} />
            <Route exact path='/create' component={Create} />
            <Route path='/show/:id' component={Show} />
            <Route path='/create/:id' component={CreateEmployee} />
            <Route path='/edit/:locationId/:id' component={EditEmployee} />
        </div>
    </Router>,
    document.getElementById('root')
);
