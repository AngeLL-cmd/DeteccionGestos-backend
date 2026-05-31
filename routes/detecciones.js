const express = require('express');
const router = express.Router();

const {
    guardarDeteccion,
    obtenerDetecciones
} = require('../controllers/deteccionesController');

router.post('/', guardarDeteccion);

router.get('/', obtenerDetecciones);

module.exports = router;