import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Edit extends Component {
    constructor (props) {
        super(props);
        this.state = this.props.location.state;
        this.location = this.state.locations.find(loc => loc._id === this.props.match.params.id);
    }

  onChange = e => {
      this.location[e.target.name] = e.target.value;
      this.forceUpdate();
  }

  onSubmit = async e => {
      e.preventDefault();
      const { _id, name, employees } = this.location;
      await axios.put(`/api/${this.location._id}`, { _id, name, oldId: this.props.match.params.id, employees });
      this.props.history.push(`/`);
  }

  render () {
      return (
          <div class="container">
              <div class="panel panel-default">
                  <div class="panel-heading">
                      <h3 class="panel-title">
                         EDIT LOCATION
                      </h3>
                  </div>
                  <div class="panel-body">
                      <h4><Link to={{
                          pathname: `/show/${this.location._id}`,
                          state: this.state,
                      }}>Back</Link></h4>
                      <form onSubmit={this.onSubmit}>
                          <div class="form-group">
                              <label for="_id">ID:</label>
                              <input type="text" class="form-control" name="_id" value={this.location._id} 
                                  onChange={this.onChange} placeholder="ID" />
                          </div>
                          <div class="form-group">
                              <label for="name">Name:</label>
                              <input type="text" class="form-control" name="name" value={this.location.name} 
                                  onChange={this.onChange} placeholder="Name" />
                          </div>
                          <button type="submit" class="btn btn-default">Submit</button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }
}

export default Edit;
