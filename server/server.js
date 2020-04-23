require('./config/config')

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

//parse app/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//declaracion de rutas desde el archivo index
app.use(require('./routes/index'));

//coneccion ala base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('base de datos online')
});
//mongoose.set('useFindAndModify', false); , useFindAndModify: false

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto:', process.env.PORT)
});