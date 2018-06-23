import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Show extends Component {
    state = this.props.location.state

    async deleteLocation (id) {
        await axios.delete(`/api/location/${id}`);
        this.props.history.push('/')
    }

    async deleteEmployee (id) {
        await axios.delete(`/api/employee/${id}`);
        const location = this.state.locations.find(loc => loc._id === this.props.match.params.id);
        const remainingEmployees = location.employees.filter(emp => emp._id !== id);
        location.employees = remainingEmployees;
        this.forceUpdate();
    }


    render () {
        const office = this.state.locations.find(loc => loc._id === this.props.match.params.id)
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            {office.name}
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to={{
                            pathname: '/',
                            state: this.state,
                        }}>Location List</Link></h4>
                        <dl>
                            <dt>Employees:</dt>
                            <dd>
                                <table class="table table-stripe">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {office.employees.map(employee =>
                                            <tr>
                                                <td>{employee._id}</td>
                                                <td>{employee.name}</td>
                                                <td>{employee.salary}</td>
                                                <td><Link to={{
                                                    pathname: `/edit/${office._id}/${employee._id}`,
                                                    state: office.employees.find(emp => emp._id === employee._id),
                                                }} class="btn btn-primary float-right">Edit</Link></td>
                                                <td><button onClick={this.deleteEmployee.bind(this, employee._id)} class="btn btn-danger float-right">Remove</button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table></dd>
                        </dl>
                        <Link to={{
                            pathname: `/edit/${office._id}`,
                            state: this.state,
                        }} class="btn btn-success">Edit location</Link>&nbsp;
                        <button onClick={this.deleteLocation.bind(this, office._id)} class="btn btn-danger">Delete location</button>&nbsp;
                        <Link to={`/create/${office._id}`} class="btn btn-primary">Add employee</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Show;
