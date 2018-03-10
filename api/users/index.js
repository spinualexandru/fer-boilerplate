const UserService = require('./users.service.js');
const UserHooks = require('./users.hooks.js');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');

const app = require('../../app.js');

app.use('user', new UserService());
app.service('user').hooks(UserHooks);

//  Test

