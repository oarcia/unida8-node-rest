const express = require('express')
const app = express()
const bodyParser = require('body-parser');
require('./config/config')

//parse app/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('hola_mundo')
});

app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {
    //res.json('post usuario')
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        })
    }

    res.json({
        persona: body
    })
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
            id
        })
        //res.json('put usuario')
});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});

app.listen(process.env.port, () => {
    console.log('escuchando puerto:', process.env.PORT)
})