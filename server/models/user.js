const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    quota: Number
})

module.exports = mongoose.model('User', userSchema, 'users')