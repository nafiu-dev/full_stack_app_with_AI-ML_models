const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')


// MIDDLEWEARES
dotenv.config({ path: './config/config.env' })
require('./config/Db')
app.use(cors())
app.use(express.json())
app.use(morgan('dev')) // for logging


// ROUTES
app.use('/api/v1', require('./routes/posts'))
app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1', require('./routes/features'))


const PORT  = process.env.PORT || 5000
app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}`))