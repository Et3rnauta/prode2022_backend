//* SERVER
const express = require('express');
const app = express();
const server = require('http').createServer(app);

//* COMPONENTS
const cors = require('cors');
app.use(cors());

require('dotenv').config();

app.use(express.json());

//* DATABASE
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

console.log("hola", uri)
try {
    mongoose.connect(uri);    
} catch (error) {
    console.log("hola", uri, error)    
}

//* LOGGER MIDDLEWARE
const commonLoggerMiddleware = require('./src/middlewares/commonLogger.middleware');

app.use(commonLoggerMiddleware);

//* VALIDATE TOKEN MIDDLEWARE
const validateTokenMiddleware = require('./src/middlewares/validateToken.middleware');

app.use(validateTokenMiddleware);

//* ROUTES
const router = require('./src/routes/index.routes');

app.use(router);

//* ERROR MIDDLEWARES
const errorMiddlewares = require('./src/middlewares/error.middleware');

app.use(errorMiddlewares.errorLogger);
app.use(errorMiddlewares.errorResponder);
app.use(errorMiddlewares.failSafeHandler);

//* INIT
const PORT = process.env.PORT || 3000;
const appServer = server.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = appServer;