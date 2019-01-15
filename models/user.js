const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // here we decide the relationship/connection between our user table and another
  // we decided that users can create an event and its more than one events
  // ref allows you to relate data - so it takes the value of the object to relate to
  // connection should also be setup in the other model
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
})

module.exports = mongoose.model('User', userSchema)
