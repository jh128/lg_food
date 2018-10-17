const db = require('../utils/mongo.util')

const UserSchema = db.Schema({
  username: { type: String, require: true},
  password: { type: String, required: true }
})

const User = db.model('Users', UserSchema)

const save = (data) => {
  return new User(data)
    .save()
    .then((result) => {
      return result
    })
    .catch((err) => {
      return false
    })
}

const findOne = (option) => {
  return User.findOne(option)
    .then((result) => {
      return result
    })
}

module.exports = {
  save,
  findOne
}
