const partidoController = require('../src/controllers/Partido.controller');
const prediccionController = require('../src/controllers/Prediccion.controller');
const puntajeController = require('../src/controllers/Puntaje.controller');
const Usuario = require('../src/models/Usuario.model');
const validarPrediccionGrupos = require('../src/utils/puntaje/validarPrediccionGrupos');

describe('Puntaje', () => {
    describe('Controller', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        it('should update Partido', async () => {
            //* Arrange
            const partidoId = 123;
            const partidoData = {
                golesEquipo1: 1,
                golesEquipo2: 0,
                seRealizo: true,
            };

            let idRecibido, dataRecibida;

            const partidosUpdate = jest.spyOn(partidoController, 'partidos_put').mockImplementationOnce(async (id, data) => {
                idRecibido = id;
                dataRecibida = data;
                return {};
            });

            jest.spyOn(Usuario, 'find').mockImplementationOnce(async () => []);
            jest.spyOn(prediccionController, 'predicciones_put').mockImplementationOnce(async () => { });

            //* Act
            await puntajeController.partido_update_resultado(partidoId, partidoData.golesEquipo1, partidoData.golesEquipo2);

            //* Assert
            jest.spyOn(Usuario, 'find').mockImplementationOnce

            expect(partidosUpdate).toHaveBeenCalledTimes(1);
            expect(idRecibido).toBe(partidoId);
            expect(dataRecibida).toMatchObject(partidoData);
        });

        it('should update Predicciones de Usuarios con el valor correcto', async () => {
            //* Arrange
            const partidoId = 123;
            const partidoData = {
                golesEquipo1: 1,
                golesEquipo2: 0,
                seRealizo: true,
            };

            jest.spyOn(partidoController, 'partidos_put').mockImplementationOnce(async () => { });

            const usuarioTest = {
                _id: 111,
                puntos: 0,
                predicciones: [{
                    _id: 222,
                    golesEquipo1: partidoData.golesEquipo1,
                    golesEquipo2: partidoData.golesEquipo2,
                    partidoId,
                }],
            };
            const usuariosFind = jest.spyOn(Usuario, 'find').mockImplementationOnce(async () => {
                return [usuarioTest];
            });

            let usuarioIdRecibido, prediccionIdRecibido, dataRecibida;
            const usuariosPrediccionesPut = jest.spyOn(prediccionController, 'predicciones_put').mockImplementationOnce(
                async (usuarioId, prediccionId, data) => {
                    usuarioIdRecibido = usuarioId;
                    prediccionIdRecibido = prediccionId;
                    dataRecibida = data;
                }
            );

            let puntosEsperados = validarPrediccionGrupos(
                {
                    golesEquipo1: usuarioTest.predicciones[0].golesEquipo1,
                    golesEquipo2: usuarioTest.predicciones[0].golesEquipo2,
                },
                {
                    golesEquipo1: partidoData.golesEquipo1,
                    golesEquipo2: partidoData.golesEquipo2,
                }
            )

            //* Act
            await puntajeController.partido_update_resultado(partidoId, partidoData.golesEquipo1, partidoData.golesEquipo2);

            //* Assert
            expect(usuariosFind).toHaveBeenCalledTimes(1);
            expect(usuariosPrediccionesPut).toHaveBeenCalledTimes(1);
            expect(usuarioIdRecibido).toBe(usuarioTest._id);
            expect(prediccionIdRecibido).toBe(usuarioTest.predicciones[0]._id);
            expect(dataRecibida).toHaveProperty('puntos');
            expect(dataRecibida["puntos"]).toBe(puntosEsperados);
        });
    })

    describe('Puntaje de Partidos en Fase de Grupos', () => {
        it('should dar 3 puntos por acertar ganador y goles', () => {
            const prediccion = {
                golesEquipo1: 0,
                golesEquipo2: 1,
            },
                partido = {
                    golesEquipo1: 0,
                    golesEquipo2: 1
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(3);
        });

        it('should dar 1 punto por acertar resultado de victoria para equipo 1 (pero no los goles)', () => {
            const prediccion = {
                golesEquipo1: 2,
                golesEquipo2: 0,
            },
                partido = {
                    golesEquipo1: 1,
                    golesEquipo2: 0
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(1);
        });

        it('should dar 1 punto por acertar resultado de victoria para equipo 2 (pero no los goles)', () => {
            const prediccion = {
                golesEquipo1: 1,
                golesEquipo2: 3,
            },
                partido = {
                    golesEquipo1: 0,
                    golesEquipo2: 2
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(1);
        });

        it('should dar 1 punto por acertar resultado de empate (pero no los goles)', () => {
            const prediccion = {
                golesEquipo1: 0,
                golesEquipo2: 0,
            },
                partido = {
                    golesEquipo1: 3,
                    golesEquipo2: 3
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(1);
        });

        it('should dar 0 puntos por no acertar resultado ni goles (empate y real victoria)', () => {
            const prediccion = {
                golesEquipo1: 0,
                golesEquipo2: 0,
            },
                partido = {
                    golesEquipo1: 0,
                    golesEquipo2: 1
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(0);
        });

        it('should dar 0 puntos por no acertar resultado ni goles (victoria para equipo 1 y real victoria para equipo 2)', () => {
            const prediccion = {
                golesEquipo1: 2,
                golesEquipo2: 1,
            },
                partido = {
                    golesEquipo1: 0,
                    golesEquipo2: 1
                };

            const resultado = validarPrediccionGrupos(prediccion, partido)
            expect(resultado).toBe(0);
        });
    });
})
