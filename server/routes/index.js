const express = require('express')

const app = express();

app.use(require('./usuario'));
//agregamos mas rutas
app.use(require('./login'));


module.exports = app