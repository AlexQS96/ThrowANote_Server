const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const port = process.env.PORT || 4000;

// Conectando a DB
connectDB();

app.use(cors({
    origin: [process.env.WEBPAGE_URL],
    methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Rutas
app.use('/', require('./routes/notes'));

app.listen(port,
    console.log(`Server Corriendo : ${port}`)
);

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})