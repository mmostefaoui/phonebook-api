const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    phoneNumber: {type: String, default: ''},
    email: {type: String, lowercase: true, debug: ''}
});

module.exports = mongoose.model("Contact", contactSchema);