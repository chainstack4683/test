const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resourceSchema = new Schema({
    email: { type: String, index: true },
    value: String
})

module.exports = mongoose.model('Resource', resourceSchema, 'resources')
