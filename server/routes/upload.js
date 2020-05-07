const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se selecciono ningun archivo'
                }

            });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreSeperado = archivo.name.split('.');
    let extension = nombreSeperado[nombreSeperado.length - 1]

    //console.log(extension);
    //return;
    //extesiones permitidas
    let extesionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if (extesionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no permitido'
            }
        })
    }

    //cambia nombre al archivo
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;



    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                    ok: false,
                    err
                })
                //aqui la imagen ya se cargo    
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });
});

const imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo

            })
        })

    });

}



const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        //let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);
        //if (fs.existsSync(pathImagen)) {
        //    fs.unlinkSync(pathImagen);
        //}
        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            })
        })

    })
}

const borraArchivo = (nombreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;