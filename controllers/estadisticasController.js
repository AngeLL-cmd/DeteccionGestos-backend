const supabase = require('../config/supabase');

const obtenerEstadisticas = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('detecciones')
            .select('*');

        if (error) {
            throw error;
        }

        const total = data.length;

        const aprobacion = data.filter(
            item => item.gesto === 'Aprobación'
        ).length;

        const consulta = data.filter(
            item => item.gesto === 'Consulta'
        ).length;

        const atencion = data.filter(
            item => item.gesto === 'Atención'
        ).length;

        const desacuerdo = data.filter(
            item => item.gesto === 'Desacuerdo'
        ).length;

        const promedioConfianza =
            total > 0
                ? (
                    data.reduce(
                        (sum, item) =>
                            sum + Number(item.confianza),
                        0
                    ) / total
                ).toFixed(2)
                : 0;

        res.json({
            success: true,
            estadisticas: {
                total,
                aprobacion,
                consulta,
                atencion,
                desacuerdo,
                promedioConfianza
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    obtenerEstadisticas
};