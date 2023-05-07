require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3080

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//Front end
app.use(express.static('front-end'))

//Se cargan todas las rutas
app.use('/api', require('./routes'))

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})

//handling signals
function signalHandler(signal) {
  server.close(() => {
    console.log(`Receive signal: ${signal}, Server Close`)
    process.exit(0)
  })
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)
process.on('SIGBREAK', signalHandler)