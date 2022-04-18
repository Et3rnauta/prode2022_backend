const router = require('express').Router();
const usuario_controller = require('../controllers/Usuario.controller');

router.get('/usuarios/:id', function (req, res, next) {
    const id = req.params.id;

    usuario_controller.usuarios_get(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.get('/usuarios', function (req, res, next) {
    usuario_controller.usuarios_list()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });

})

router.post('/usuarios', function (req, res, next) {
    const data = req.body;

    usuario_controller.usuarios_create_post(data)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.delete('/usuarios/:id', function (req, res, next) {
    const id = req.params.id;

    usuario_controller.usuarios_delete(id)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

module.exports = router;