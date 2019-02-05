const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 3000
const HOST = '0.0.0.0';
const api = require('./routes/api')

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.use('/api', api)
app.get('/', function(req, res) {
    res.send('Hello form server')
})

app.listen(PORT, HOST, function(){ 
    console.log(`Running on http://${HOST}:${PORT}`)
})
