const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

module.exports = {
  hash: async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
  },
  compare: async (password, hash) => {
    return await bcrypt.compare(password, hash)
  }
}
