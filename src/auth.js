const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const USER = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD
}

const compare = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

module.exports = {
  hash: async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
  },

  compare,

  isCorrectEmail: (email) => {
    return email === USER.email
  },

  isCorrectPassword: async (password) => {
    return await compare(password, USER.password)
  }
}
