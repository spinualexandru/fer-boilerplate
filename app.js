const rest = require('feathers-rest'),
    socketio = require('feathers-socketio'),
    express = require('@feathersjs/express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    lessMiddleware = require('less-middleware'),
    SlackStrategy = require('@aoberoi/passport-slack').default.Strategy,
    passport = require('passport'),
    index = require('./routes/index'),
    session = require('express-session'),
    feathers = require('@feathersjs/feathers');
module.exports = api = express(feathers()).configure(express.rest());
const Users = require('./api/users'),
    users = require('./routes/users'),
    app = express()
    //TO-DO Merge routes
    .use('/api/v1', api)
    .use('/users', users);

passport.use(new SlackStrategy({
    clientID: "X",
    clientSecret: "X"
}, (accessToken, scopes, team, extra, profiles, done) => {

    done(null, profiles.user);
}));

passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user));
});

app .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(logger('dev'))
    .use(cookieParser('CHANGE'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(lessMiddleware(path.join(__dirname, 'public')))
    .use(express.static(path.join(__dirname, 'public')))
    .use(passport.initialize())
    .use(passport.session())
    .use(session({
        cookie: {
            // secure: true,
        },
        resave: false,
        saveUninitialized: false,
        secret: 'CHANGE',
    }))
    .get('/auth/slack', passport.authorize('slack'))
    .get('/auth/slack/callback', (req, res, next) => {
        passport.authenticate('slack', (err, user, info) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log(user);
            if (!user) {
                return res.redirect('/auth/slack');
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                console.log(user);
                return res.redirect('http://localhost:3000/');
            });
        })(req, res, next)
    })
    .use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    })
    .use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });
const server = app.listen(3001);
api.setup(server);