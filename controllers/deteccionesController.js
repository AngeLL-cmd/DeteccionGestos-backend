const supabase = require('../config/supabase');

const {
    guardarGesto
} = require('../services/gestureService');

const guardarDeteccion = async (req, res) => {

    try {

        const { gesto, confianza } = req.body;

        if (!gesto || confianza === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos'
            });
        }

        const resultado = await guardarGesto(
            gesto,
            confianza
        );

        if (!resultado.success) {
            return res.status(200).json(resultado);
        }

        res.status(201).json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const obtenerDetecciones = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('detecciones')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            total: data.length,
            data
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
    guardarDeteccion,
    obtenerDetecciones
};