//* SERVER
const express = require('express');
const app = express();
const server = require('http').createServer(app);

//* COMPONENTS
const cors = require('cors');
require('dotenv-safe').config();
app.use(cors());
app.use(express.json());

//* DATABASE
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

mongoose.connect(uri);

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