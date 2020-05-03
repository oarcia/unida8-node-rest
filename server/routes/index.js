const express = require('express')

const app = express();

app.use(require('./usuario'));
//agregamos mas rutas
app.use(require('./login'));
//agragamos la ruta de categorias
app.use(require('./categoria'));
//agregamos la ruta de productos
app.use(require('./producto'));


module.exports = app