const router = require('express').Router();
const jugador_controller = require('../controllers/Jugador.controller');

router.get('/jugadores', function (req, res, next) {
    jugador_controller.jugadores_list()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });

})

router.put('/mejores-jugadores', function (req, res, next) {
    const mejorJugador= req.body.mejorJugador; 
    const mejorArquero= req.body.mejorArquero; 
    const mejorGoleador= req.body.mejorGoleador; 

    jugador_controller.jugadores_actualizar_mejores(mejorJugador, mejorArquero, mejorGoleador)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

module.exports = router;