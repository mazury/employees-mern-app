import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import App from '../App';

class Create extends Component {                
    state = {
        id: '',
        name: '',
    };

  onChange = e => {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);
  }

  onSubmit = async e => {
      e.preventDefault();
      const { id, name } = this.state;
      await axios.post('/api', { _id: id, name, employees: [] });
      this.props.history.push('/');
  }

  render () {
      const { id, name } = this.state;
      return (
          <div class="container">
              <div class="panel panel-default">
                  <div class="panel-heading">
                      <h3 class="panel-title">
                        ADD LOCATION
                      </h3>
                  </div>
                  <div class="panel-body">
                      <h4><Link to="/">Back</Link></h4>
                      <form onSubmit={this.onSubmit}>
                          <div class="form-group">
                              <label for="id">ID:</label>
                              <input type="text" class="form-control" name="id" value={id} onChange={this.onChange} placeholder="ID" />
                          </div>
                          <div class="form-group">
                              <label for="name">Name:</label>
                              <input type="text" class="form-control" name="name" value={name} onChange={this.onChange} placeholder="Name" />
                          </div>
                          <button type="submit" class="btn btn-default">Submit</button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }
}

export default Create;
