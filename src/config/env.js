const path = require('path')
const process = require('process')

const load = () => {
  let fileName = '.env'
  if (process.env.NODE_ENV === 'test') {
    fileName += '.test'
  }
  const ENV_FILE = path.resolve(process.cwd(), fileName)
  require('dotenv').config({ path: ENV_FILE })
}

module.exports = {
  load
}
