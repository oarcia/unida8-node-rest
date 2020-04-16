const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//cuando agregamos el valor unique require es para especificar valores unicos declaramos el unicvalidator


//para administrar los roles ponemos lo siguiente.
let rolesValios = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'la constraseña es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValios
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//con esto quitamos el password al momneto de regresa el json
usuarioSchema.methods.toJSON = function() {
        let user = this;
        let userObjet = user.toObject();
        delete userObjet.password;

        return userObjet;
    }
    //aqui utilizamos el plugin
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} DEBE DE SER UNICO' });

module.exports = mongoose.model('Usuario', usuarioSchema);