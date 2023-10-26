const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

/* middleware */
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

/* routes */
const accountRoutes = require('./routes/Accounts')

app.use('/accounts', accountRoutes)

/* dbconnection */

const dbConfig = "mongodb://localhost:27017"
const dbName = "e-schoolappdb";

mongoose.connect(`${dbConfig}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const port = 3000

app.listen(port, ()=> {
    console.log('Listening to port: ', port)
})