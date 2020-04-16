//===============================
//puert
//===================

process.env.PORT = process.env.PORT || 3000;

//===============================
//Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
//Base de datos
//===================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://strider:dbzYI0zQ0MNsP7Vj@uniclick-zg4pg.mongodb.net/cafe'
}

process.env.URLDB = urlDB;