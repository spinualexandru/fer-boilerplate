var express = require('express');
var router = express.Router();
var _ = require('underscore');
/* GET users listing. */
var express = require('express');
var router = express.Router();
let users = [];
const app = require('../app');;

 
/* GET users listing. */
router.get('/profile', (req, res)=> {
  res.json(req.user);
});
router.get('/add/:name', async (req, res) => {
  const {name} = req.params; 
  const users = await app.service('user').find({name})
  console.log(users);
  if(_.isEmpty(users)) {
    res.json(await app.service('user').create({
      name: name
    }));
  }else{
    res.send(users);
  } 
  
});
router.get('/remove', (req, res) => {
  users = _.reject(users, name => req.user.name);
  res.json(users)
})
router.get('/', async function(req, res, next) {

  res.json(await app.service('user').find());

});

module.exports = router;
