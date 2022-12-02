const router = require('express').Router();
const partido_controller = require('../controllers/Partido.controller');
const partido_final_controller = require('../controllers/PartidoFinal.controller');
const puntaje_controller = require('../controllers/Puntaje.controller');

router.get('/partidos/:id', function (req, res, next) {
    const id = req.params.id;

    partido_controller.partidos_get(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.get('/partidos', function (req, res, next) {
    partido_controller.partidos_list()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.get('/partidos-final', function (req, res, next) {
    partido_final_controller.partidos_list_final()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.post('/partidos', function (req, res, next) {
    const data = req.body;

    partido_controller.partidos_create_post(data)
        .then((answer) => {
            res.status(201);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.put('/partidos/:id/update_score', function (req, res, next) {
    const id = req.params.id;
    const golesEquipo1 = req.body.golesEquipo1;
    const golesEquipo2 = req.body.golesEquipo2;

    puntaje_controller.partido_update_resultado(id, golesEquipo1, golesEquipo2)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((error) => {
            next(error);
        });
})

router.put('/partidos/:id', function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    partido_controller.partidos_put(id, data)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.delete('/partidos/:id', function (req, res, next) {
    const id = req.params.id;

    partido_controller.partidos_delete(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

module.exports = router;