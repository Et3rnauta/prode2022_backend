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

module.exports = router;