import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class EditEmployee extends Component {
  state = this.props.location.state;

  onChange = e => {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);
  }

  onSubmit = async e => {
      e.preventDefault();
      const params = this.props.match.params;
      const { name, salary } = this.state;
      await axios.put(`/api/${params.locationId}/${params.id}`, { name, salary });
      this.props.history.push('/');
  }

  render () {
      const { name, salary } = this.state;
      return (
          <div class="container">
              <div class="panel panel-default">
                  <div class="panel-heading">
                      <h3 class="panel-title">
                         EDIT EMPLOYEE
                      </h3>
                  </div>
                  <div class="panel-body">
                      <h4><Link to='/'>Locations</Link></h4>
                      <form onSubmit={this.onSubmit}>
                          <div class="form-group">
                              <label for="name">Name:</label>
                              <input type="text" class="form-control" name="name" value={name} onChange={this.onChange} />
                          </div>
                          <div class="form-group">
                              <label for="salary">Salary:</label>
                              <input type="text" class="form-control" name="salary" value={salary} onChange={this.onChange}/>
                          </div>
                          <button type="submit" class="btn btn-default">Submit</button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }
}

export default EditEmployee;
