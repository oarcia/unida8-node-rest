const express = require('express');

const { verificacionToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');

//====================
//obtener productos
//====================
app.get('/productos', verificacionToken, (req, res) => {
    //trae todos los productos
    //popule de usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        });

});


//====================
//obtener producto por id
//====================
app.get('/productos/:id', verificacionToken, (req, res) => {
    //popule de usuario categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id del producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
});

//====================
//buscar  productos por nombre
//====================
app.get('/productos/buscar/:termino', verificacionToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })
})


//====================
//crear nuevo producto
//====================
app.post('/productos', verificacionToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let body = req.body;
    //para definir viene del modelo de usuario
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        ///if (!productoDB) {
        ///    return res.status(400).json({
        ///        ok: false,
        ///        err
        ///    });
        ///}
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});

//====================
//actualizar un nuevo producto
//====================
app.put('/productos/:id', verificacionToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.descripcion = body.descripcion,
            productoDB.disponible = body.disponible,
            productoDB.categoria = body.categoria

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })


    })
});

//====================
//borrar un  producto
//====================
app.delete('/productos/:id', verificacionToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoBorrado,
                mensaje: 'productoBorrado'
            })
        })
    })

});



module.exports = app;