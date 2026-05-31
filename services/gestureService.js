const supabase = require('../config/supabase');

const MIN_CONFIDENCE = 90;

const guardarGesto = async (gesto, confianza) => {

    if (confianza < MIN_CONFIDENCE) {
        return {
            success: false,
            message: 'Confianza insuficiente'
        };
    }

    const { data, error } = await supabase
        .from('detecciones')
        .insert([
            {
                gesto,
                confianza
            }
        ])
        .select();

    if (error) {
        throw error;
    }

    return {
        success: true,
        message: 'Detección guardada',
        data
    };

};

module.exports = {
    guardarGesto
};