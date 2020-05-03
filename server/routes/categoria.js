const express = require('express');

const { verificacionToken, verificaRole } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria');

//========================
//Mostar todas las categorias
//=============================
app.get('/categoria', verificacionToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })

        })

});

//========================
//Mostar una categoria 
//=============================

app.get('/categoria/:id', verificacionToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'id no valido'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

//========================
//crea nueva categoria
//=============================
app.post('/categoria', verificacionToken, (req, res) => {
    //regresa la nueva ctegoria
    //req.usuario_id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//========================
//actuliza categoria
//=============================
app.put('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

//========================
//elimina categoria
//=============================
app.delete('/categoria/:id', [verificacionToken, verificaRole], (req, res) => {
    //solo un administrador puede borrar
    //categoria.findbyidandremove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es valido'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    })

})



module.exports = app;