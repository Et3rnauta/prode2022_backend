const router = require('express').Router();
const prediccion_controller = require('../controllers/Prediccion.controller');

router.post('/usuarios/:id/prediccion', function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    prediccion_controller.predicciones_create_post(id, data)
        .then((answer) => {
            res.status(201);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

router.delete('/usuarios/:id/prediccion/:prediccionId', function (req, res, next) {
    const id = req.params.id;
    const prediccionId = req.params.prediccionId;

    prediccion_controller.predicciones_delete(id, prediccionId)
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
})

module.exports = router;