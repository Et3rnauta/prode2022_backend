const router = require('express').Router();
const master_controller = require('../controllers/MasterController');

router.delete('/limpiar_partidos_equipos', function (req, res, next) {
    master_controller.limpiar_partidos_equipos()
        .then((answer) => {
            res.status(204);
            res.send();
        })
        .catch((error) => {
            next(error);
        });
});

router.put('/limpiar_predicciones_partidos', function (req, res, next) {
    master_controller.limpiar_predicciones_partidos()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;