const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./config/authentification');
const User = require('./app/models/user');
const configDb = require("./config/database");

mongoose.connect(configDb.database);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('superSecret', configDb.secret);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.use(passport.initialize());

app.get('/setup', function(req, res) {

    // create a sample user
    const admin = new User({
        username: 'admin',
        password: 'password',
    });

    // save the sample user
    admin.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

// Routes
const contactRoutes = require("./app/routes/contactRoutes");
const userRoutes = require("./app/routes/userRoutes");

app.use('/api/contacts/', contactRoutes);
app.use('/api/users/', userRoutes);

app.listen(port, function (err) {
    if (err) throw err;
    console.log("Server is started at http://localhost:" + port);
});

module.exports = app;
