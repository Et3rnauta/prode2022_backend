const Equipo = require('../models/Equipo.model');
const Partido = require('../models/Partido.model');

module.exports.limpiar_partidos_equipos = async function () {
    let fullRes = {};

    const equipoRes = await Equipo.deleteMany();
    
    if (equipoRes.acknowledged) {
        fullRes.equiposEliminados = equipoRes.deletedCount;
        
        
        const partidoRes = await Partido.deleteMany();
        console.log(partidoRes)
        if (partidoRes.acknowledged) {
            fullRes.acknowledged = true;
            fullRes.partidosEliminados = partidoRes.deletedCount;
        } else {
            fullRes.acknowledged = false;
        }
    } else {
        fullRes.acknowledged = false;
    }

    return fullRes;
}