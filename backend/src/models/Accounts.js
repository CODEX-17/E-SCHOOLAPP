const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
    acctype: {
        type: String,
        required: true
    },
    studentid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('accounts', accountSchema)