const router = require('express').Router();
const partido_controller = require('../controllers/Partido.controller');

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