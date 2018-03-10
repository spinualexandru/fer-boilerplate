import React, {
  Component
} from 'react';
import _ from 'underscore';
import './App.css';

import { Header } from 'react-semantic-ui';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      notLogged: false,
      user: {}
    }
  }
  getProfile() {
    fetch('/users/profile', {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(user => this.setState({ user }))
  }
  getUsers() {
    fetch('/users', {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(users => {
        console.log(users);
        this.setState({
          users
        })
        //this.getProfile();
      });
  }
  componentDidMount() {
    const {user} = this.state;
    this.getUsers();
 
    
  }
  add() {
    fetch('/users/add/Server: Hello Robot', {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(users => this.setState({ users }))
      this.getUsers()

  }
  remove() {
    fetch('/users/remove', {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(users => this.setState({ users }))
  }
  isRegistered() {
    const { user, users } = this.state;
    return _.contains(users, user.name);
  }
  render() {
    const { users, notLogged, user
    } = this.state;

    const userExists = !_.isEmpty(user);
    console.log(userExists);
    const isRegistered = this.isRegistered();
    return (<div classNameName="App">
      {
        !user && <h1>You are not logged in</h1>
      }

      <p classNameName="App-intro" >
        <form className="form-signin">
       
          {
         
            <div>
              <img className="mb-4" src={user.image_512 || "https://www.formassembly.com/images/illustrations/avatar-robot.png"} alt="" width="72" height="72"></img>
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
