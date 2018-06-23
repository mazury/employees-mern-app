import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

class App extends Component {
    state = { locations: [] };

    async componentDidMount () {
        if (this.props.location.state) {
            this.setState( { locations: this.props.location.state.locations });
        } else {
            const locations = await axios.get('/api');
            this.setState({ locations: locations.data });
        }
    }

    avgSalary (location) {
        let totalSalary = 0;
        location.employees.forEach(employee => {
            totalSalary += employee.salary;
        });
        return totalSalary > 0 ? (totalSalary / location.employees.length).toFixed(0) : 0;
    }

    render () {
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            EMPLOYEES APP
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to='/create'>Add Location</Link></h4>
                        <table class="table table-stripe">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Number of employees</th>
                                    <th>Average salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.locations.map(location =>
                                    <tr>
                                        <td><Link to={{
                                            pathname: `/show/${location._id}`,
                                            state: this.state,
                                        }}>{location._id}</Link></td>
                                        <td>{location.name}</td>
                                        <td>{location.employees.length}</td>
                                        <td>{this.avgSalary(location)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
