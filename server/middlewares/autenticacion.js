const jwt = require('jsonwebtoken');

//====================================
//verifica token
//====================================
let verificacionToken = (req, res, next) => {
    let token = req.get('token'); //dependiendo del nombre que le pongas 
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

    //res.json({
    //    token
    //});
}

//====================================
//verifica admin role
//====================================
let verificaRole = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es un Administrador'
            }
        })
    }
};





module.exports = {
    verificacionToken,
    verificaRole
}