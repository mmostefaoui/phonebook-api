const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return next();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function (password, next) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return next(err);
        next(null, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema);