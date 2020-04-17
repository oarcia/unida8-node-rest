const express = require('express')
    //bcrypt lo utilizamos para encriptar la contraseña
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
//con esto accedemos a verica token y lo ponemos en el  get para traer el token
const { verificacionToken, verificaRole } = require('../middlewares/autenticacion')

const app = express();

//en esta parte traemos los usuarios con filtro es decir limites y desde cuales
app.get('/usuario', verificacionToken, (req, res) => {
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });
    //res.json('get usuario local')
    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img') //{google: true }valida los usuarios que tienen google true 
        //para excluir o decir que campos quiero que regrese le ponemos los argumentos arriba
        .skip(desde) //salta los primero 5
        .limit(limite) //limita a 5 resultados
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => { //google: true 
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })
});

app.post('/usuario', [verificacionToken, verificaRole], (req, res) => {

    let body = req.body;
    //definimos el esquema de la base de los campos que nesecitamos
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //aqui llamamos el bcrypt y le damos 10 vueltas
        role: body.role
    });
    //con esto guardamos en la base de datos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null con esto quitamos el valor del password

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

//actualizacion de registro
app.put('/usuario/:id', [verificacionToken, verificaRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']) //el _.pick representa alo datos que quiero que regrese

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
                ok: true,
                usuario: usuarioDB
            })
            //res.json('put usuario')
    })


});


app.delete('/usuario/:id', [verificacionToken, verificaRole], (req, res) => {
    //res.json('delete usuario')
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBrr) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };


        if (usuarioBrr === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        };


        res.json({
            ok: true,
            usuario: usuarioBrr
        })
    })

    //elimina completamente el archivo
    //Usuario.findByIdAndRemove(id, (err, usuarioBrr) => {
    //
    //    if (err) {
    //        return res.status(400).json({
    //            ok: false,
    //            err
    //        });
    //    };
    //
    //
    //    if (usuarioBrr === null) {
    //        return res.status(400).json({
    //            ok: false,
    //            err: {
    //                message: 'usuario no encontrado'
    //            }
    //        });
    //    };
    //
    //
    //    res.json({
    //        ok: true,
    //        usuario: usuarioBrr
    //    })
    //})
});

//exportamos el archivo app a todas la rutas
module.exports = app;