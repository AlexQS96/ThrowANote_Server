const mongoose = require('mongoose');
require('dotenv').config({ path: 'var.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB Conectado con Exito");
    } catch (error) {
        console.log("Hubo un Error: "+error);
        process.exit(1);
    }
}

module.exports = connectDB;