//* SERVER
const express = require('express');
const app = express();
const server = require('http').createServer(app);

//* COMPONENTS
const cors = require('cors');
app.use(cors());

require('dotenv-safe').config();

app.use(express.json());

//* DATABASE
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

mongoose.connect(uri);

//* LOGGER MIDDLEWARE
const commonLoggerMiddleware = require('./src/middlewares/commonLogger.middleware');

app.use(commonLoggerMiddleware);

//* ROUTES
const router = require('./src/routes/index.routes');

app.use(router);

//* ERROR MIDDLEWARES
const errorMiddlewares = require('./src/middlewares/error.middleware');

app.use(errorMiddlewares.errorLogger);
app.use(errorMiddlewares.errorResponder);
app.use(errorMiddlewares.failSafeHandler);

//* INIT
const PORT = process.env.SERVER_PORT || 3000;
const appServer = server.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = appServer;