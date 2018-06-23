import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import App from '../App';

class CreateEmployee extends Component {               
    state = {
        id: '',
        name: '',
        salary: '',
    };

  onChange = e => {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);
  }

  onSubmit = async e => {
      e.preventDefault();
      const { name, salary } = this.state;
      await axios.post(`/api/${this.props.match.params.id}`, { name, salary });
      this.props.history.push('/');
  }

  render () {
      const { name, salary } = this.state;
      return (
          <div class="container">
              <div class="panel panel-default">
                  <div class="panel-heading">
                      <h3 class="panel-title">
                        ADD EMPLOYEE
                      </h3>
                  </div>
                  <div class="panel-body">
                      <h4><Link to='/'>Locations</Link></h4>
                      <form onSubmit={this.onSubmit}>
                          <div class="form-group">
                              <label for="name">Name:</label>
                              <input type="text" class="form-control" name="name" value={name} onChange={this.onChange} placeholder="Name" />
                          </div>
                          <div class="form-group">
                              <label for="salary">Salary:</label>
                              <input type="text" class="form-control" name="salary" value={salary} onChange={this.onChange} placeholder="Salary" />
                          </div>
                          <button type="submit" class="btn btn-default">Submit</button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }
}

export default CreateEmployee;
