const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../app/models/user');

passport.use(new BasicStrategy((username, password, next) => {
        User.findOne({username: username}, (err, user) => {

            if (err) return next(err);

            if (!user) return next(null, false);

            user.verifyPassword(password, (err, isMatch) => {
                if (err) return next(err);

                if (!isMatch) return next(null, false);

                return next(null, user);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});