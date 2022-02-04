const express = require('express')
const path = require('path');
const chalk = require('chalk');
const cors = require('cors');
const http = require('http');
const app = express();
require('dotenv').config();

// ? Set App variables
app.set('port', process.env.PORT);
app.set('host', process.env.HOST);

// ? CORS
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// * Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// * Static Files
app.use(express.static(path.join(__dirname)));
    
// * ROUTES
app.use(require('./api/routes/all.routes'));

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('[',chalk.green("OK"),`] Server running at http://${app.get('host')}:${app.get('port')}/`);
});