const router = require('express').Router();
const equipo_controller = require('../controllers/Equipo.controller');

router.get('/equipos/:id', function (req, res, next) {
    const id = req.params.id;

    equipo_controller.equipos_get(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.put('/equipos/:id', function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    equipo_controller.equipos_put(id, data)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.get('/equipos', function (req, res, next) {
    equipo_controller.equipos_list()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });

})

router.post('/equipos', function (req, res, next) {
    const data = req.body;

    equipo_controller.equipos_create_post(data)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.delete('/equipos/:id', function (req, res, next) {
    const id = req.params.id;

    equipo_controller.equipos_delete(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

module.exports = router;