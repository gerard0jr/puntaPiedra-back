require('dotenv').config()

let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser');
let express = require('express');
let favicon = require('serve-favicon')
let logger = require('morgan');
let path = require('path');
let cors = require('cors')

var app = express();

app.use(cors({
  credentials: true,
  origin: true
}))

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public', 'static')))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.locals.title = 'Punta Piedra APP'

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

module.exports = app;
