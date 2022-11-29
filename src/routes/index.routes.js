const app = require('express')();
const userRouter = require('./Usuario.routes');
const prediccionRouter = require('./Prediccion.routes');
const equipoRouter = require('./Equipo.routes');
const partidoRouter = require('./Partido.routes');
const jugadorRouter = require('./Jugador.routes');
const masterRoutes = require('./Master.routes');

app.use(userRouter);
app.use(prediccionRouter);
app.use(equipoRouter);
app.use(partidoRouter);
app.use(jugadorRouter);
app.use(masterRoutes);

module.exports = app;