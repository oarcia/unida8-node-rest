//===============================
//puert
//===================

process.env.PORT = process.env.PORT || 3000;

//===============================
//Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
//vencimiento de token
//el token solo esta vivo 1 hora
//=========================
process.env.CADUCIDAD_TOKEN = '48h';



//===============================
//vencimiento de token
//seed o semilla dle token elseed esta en la vairbale de entorno del despliegue----------
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//===============================
//Base de datos
//===================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//===============================
//google Client ID
//===================


process.env.CLIENT_ID = process.env.CLIENT_ID || '574479812760-9aqh2g7iack21fl41p8r6sq5vqks0597.apps.googleusercontent.com';