const fs = require("fs");
const { parse } = require("csv-parse");

const jugadorController = require("../../controllers/Jugador.controller");
const equipoController = require("../../controllers/Equipo.controller");

module.exports = async function () {
    let equipos = await equipoController.equipos_list();
    console.log(equipos[0]);
    fs.createReadStream("/home/guido/Documents/world-cup-players.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", async function (row) {
            let equipo = equipos.find(e => e.nombre == row[0])._id;
            let newJugador = {
                nombre: row[3],
                posicion: row[2],
                numero: row[1],
                equipo,
            }
            await jugadorController.jugadores_create_post(newJugador);
        })
        .on("error", function (error) {
            console.log(error.message);
        })
        .on("end", function () {
            console.log("finished");
        });
}