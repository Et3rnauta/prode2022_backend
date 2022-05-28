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