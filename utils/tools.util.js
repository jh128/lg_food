const bcrypt = require('bcrypt')
module.exports = {
  crypt(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(err, salt) {
        return bcrypt.hash(password, salt, function(err, hash) {
          resolve(hash)
        });
      });
    })
  },

  compare({hash_password, password}) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash_password, function(err, res) {
        resolve(res)
      })
    })
  }
}
