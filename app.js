
    const rest = require('feathers-rest');
    const socketio = require('feathers-socketio');
 


    const express = require('@feathersjs/express');
    const path = require('path');
    const favicon = require('serve-favicon');
    const logger = require('morgan');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const lessMiddleware = require('less-middleware');
    const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;
    const passport = require('passport');
    const index = require('./routes/index');
    const session = require('express-session');
    const feathers = require('@feathersjs/feathers');
    const featherss = require('feathers');

    const api = express(feathers())
    .configure(express.rest());
    module.exports = api;
    const Users = require('./api/users');
    const users = require('./routes/users');
    const app = express().use('/api/v1', api); 

    app.use('/users', users);
  
    passport.use(new SlackStrategy({
        clientID: "$",
        clientSecret: "$"
    }, (accessToken, scopes, team, extra, profiles, done) => {

        done(null, profiles.user);
    }));

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });


    passport.deserializeUser((user, done) => {
        done(null, JSON.parse(user));
    });

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(cookieParser('CHANGE'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(lessMiddleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));

    const cookieExpirationDate = new Date();
    const cookieExpirationDays = 365;
    cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays)

    app.use(passport.initialize());
    
    app.use(passport.session());
    app.use(session({
        cookie: {
            // secure: true,
        },
        resave: false,
        saveUninitialized: false,
        secret: 'CHANGE',
    }));



    app.get('/auth/slack', passport.authorize('slack'));

    // OAuth callback url 
    app.get('/auth/slack/callback', function (req, res, next) {
        passport.authenticate('slack', function (err, user, info) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log(user);
            if (!user) {
                return res.redirect('/auth/slack');
            }
            req.logIn(user, function (err) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                console.log(user);
                return res.redirect('http://localhost:3000/');
            });
        })(req, res, next)

    });

    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });

    const server = app.listen(3001);
    api.setup(server);


