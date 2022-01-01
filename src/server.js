const buildApp = require('./build-app')

const start = async () => {
  try {
    const app = await buildApp()
    const PORT = app.config.PORT
    await app.listen(PORT, '0.0.0.0')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
