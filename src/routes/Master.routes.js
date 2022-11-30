const router = require('express').Router();
const bcrypt = require('bcrypt');
const master_controller = require('../controllers/MasterController');
const usuario_controller = require('../controllers/Usuario.controller');
const refresh_token_controller = require('../controllers/RefreshToken.controller');
const generateAccessToken = require('../utils/generateAccessToken');
const generateRefreshToken = require('../utils/generateRefreshToken');
const jsonwebtoken = require('jsonwebtoken');

const partido_controller = require('../controllers/Partido.controller');
const puntaje_controller = require('../controllers/Puntaje.controller');
const agregarJugadores = require('../utils/jugadores/agregarJugadores');

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
            res.send({ accessToken, refreshToken, userId: userWithPass._id });
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

router.put('/puntaje-prueba', async function (req, res, next) {
    try {
        // Grupo A
        await puntaje_controller.partido_update_resultado("625e040c570a70de1c3d6be8", 0, 0);
        await puntaje_controller.partido_update_resultado("625e040c570a70de1c3d6bec", 1, 0);
        await puntaje_controller.partido_update_resultado("625e040c570a70de1c3d6bf0", 3, 1);
        await puntaje_controller.partido_update_resultado("625e040d570a70de1c3d6bf4", 0, 2);
        await puntaje_controller.partido_update_resultado("625e040d570a70de1c3d6bf8", 2, 2);
        await puntaje_controller.partido_update_resultado("625e040d570a70de1c3d6bfc", 2, 3);

        // Argentina - Grupo C
        await puntaje_controller.partido_update_resultado("625e0642570a70de1c3d6c2c", 3, 0);
        await puntaje_controller.partido_update_resultado("625e0643570a70de1c3d6c30", 2, 1);
        await puntaje_controller.partido_update_resultado("625e0643570a70de1c3d6c34", 1, 1);
        await puntaje_controller.partido_update_resultado("625e0643570a70de1c3d6c34", 1, 1);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

router.delete('/puntaje-prueba', async function (req, res, next) {
    try {
        // Grupo A
        await partido_controller.partidos_put("625e040c570a70de1c3d6be8", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e040c570a70de1c3d6bec", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e040c570a70de1c3d6bf0", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e040d570a70de1c3d6bf4", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e040d570a70de1c3d6bf8", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e040d570a70de1c3d6bfc", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })

        // Argentina - Grupo C
        await partido_controller.partidos_put("625e0642570a70de1c3d6c2c", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e0643570a70de1c3d6c30", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        await partido_controller.partidos_put("625e0643570a70de1c3d6c34", { golesEquipo1: null, golesEquipo2: null, seRealizo: false })
        
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

router.delete('/logout', async function (req, res) {
    await refresh_token_controller.refresh_token_delete(req.body.token);
    res.sendStatus(204);
});

router.post('/agregar-jugadores', async function (req, res) {
    try {
        await agregarJugadores();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

router.get('/test', async function (req, res) {
    res.status(200);
    res.send({ message: "Live from New York, it's Saturday Night!" });
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