const router = require('express').Router();
const bcrypt = require('bcrypt');
const master_controller = require('../controllers/MasterController');
const usuario_controller = require('../controllers/Usuario.controller');
const refresh_token_controller = require('../controllers/RefreshToken.controller');
const generateAccessToken = require('../utils/generateAccessToken');
const generateRefreshToken = require('../utils/generateRefreshToken');
const jsonwebtoken = require('jsonwebtoken');

router.post('/login', async function (req, res, next) {
    const data = req.body;

    try {
        const userWithPass = await usuario_controller.usuarios_get_by_name_with_password(data.username);

        if (req.body.password && await bcrypt.compare(req.body.password, userWithPass.password)) {
            const user = {
                _id: userWithPass._id,
                nombreCuenta: userWithPass.nombreCuenta,
            }

            const accessToken = generateAccessToken(user);

            // TODO ver si implementar para que haya solo un refresh x user
            const refreshToken = generateRefreshToken(user);
            await refresh_token_controller.refresh_token_post(refreshToken);

            res.status(200);
            res.send({ accessToken, refreshToken });
        } else {
            throw {
                number: 401,
                content: "Contraseña incorrecta",
            }
        }
    } catch (error) {
        next(error);
    }
});

router.post('/token', async function (req, res) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    let tokenExists = await refresh_token_controller.refresh_token_exists(refreshToken);
    if (!tokenExists) return res.sendStatus(403);

    jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({
            _id: user._id,
            nombreCuenta: user.nombreCuenta,
        });
        res.status(200);
        res.send({ accessToken });
    })
});

router.delete('/logout', async function (req, res) {
    await refresh_token_controller.refresh_token_delete(req.body.token);
    res.sendStatus(204);
});

router.get('/test', async function (req, res) {
    res.sendStatus(204);
})

//* Aux routes
router.delete('/limpiar_partidos_equipos', function (req, res, next) {
    master_controller.limpiar_partidos_equipos()
        .then((answer) => {
            res.sendStatus(204);
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

router.delete('/token', function (req, res, next) {
    refresh_token_controller.refresh_token_delete_all()
        .then((answer) => {
            res.status(200);
            res.send(answer);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;