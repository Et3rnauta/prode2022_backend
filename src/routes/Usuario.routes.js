const router = require('express').Router();
const bcrypt = require('bcrypt');
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

router.get('/usuarios-con-password/:id', function (req, res, next) {
    const id = req.params.id;

    usuario_controller.usuarios_get_with_password(id)
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

router.post('/usuarios', async function (req, res, next) {
    const data = req.body;

    try {
        data.password = await bcrypt.hash(req.body.password, 10);
        const answer = await usuario_controller.usuarios_create_post(data);

        res.status(201);
        res.send(answer);
    } catch (error) {
        next(error);
    }
})

// TODO agregar ruta put que actualiza los scores de los jugadores

router.put('/usuarios/:id', async function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    if (data.password) data.password = await bcrypt.hash(req.body.password, 10);

    usuario_controller.usuarios_put(id, data)
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