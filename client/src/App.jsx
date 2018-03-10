import React, {Component} from 'react';
import _ from 'underscore';
import './App.css';
import { Header } from 'react-semantic-ui';
const sameOrigin = {
  credentials: "same-origin"
};
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      user: {}
    }
  }
  async getUsers() {
    const users = await (await fetch('/users', sameOrigin)).json();
    console.log(users);
    this.setState({users: users});
  }
  componentDidMount() {
    const {user} = this.state;
    this.getUsers();
  }
  async add() {
      const user = await (await fetch('/users/add/Server: Hello Robot', sameOrigin)).json()
      this.setState({ users:user })
      this.getUsers()

  }
  remove() {
    fetch('/users/remove', sameOrigin)
      .then(res => res.json())
      .then(users => this.setState({ users }))
  }
  render() {
    const {users} = this.state;
    return (<div classNameName="App">
      <p classNameName="App-intro" >
        <form className="form-signin">
       
          {
         
            <div>
              <img className="mb-4" src="https://www.formassembly.com/images/illustrations/avatar-robot.png" alt="" width="72" height="72"></img>
              <p className="text-muted">Welcome to my boilerplate</p>
              <button type="button" className="btn btn-primary" onClick={this.add.bind(this)} >Call Server</button>
              

              <ul class="list-group">
              {
                _.map(users, user => {
                  return (
                    <li class="list-group-item">{user.name}</li>
                  )
                })
              }
              </ul>
            </div>
          } 
        </form>
      </p>
    </div>
    );
  }
}
