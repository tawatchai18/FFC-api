const mongoose = require('mongoose')
const Schema = mongoose.Schema
var moment = require('moment');
var years = moment().diff('years', false);
const personSchema = new Schema({
  sex:  String,
  birthdate: years,
})

const PersonModel = mongoose.model('person', personSchema)

module.exports = PersonModel