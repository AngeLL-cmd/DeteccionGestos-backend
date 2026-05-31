require('dotenv').config();

const express = require('express');
const cors = require('cors');

const deteccionesRoutes = require('./routes/detecciones');
const estadisticasRoutes = require('./routes/estadisticas');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.json({
        proyecto: 'SmartGesture Analytics',
        estado: 'Activo'
    });

});

app.use('/api/detecciones', deteccionesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor iniciado en puerto ${PORT}`);

});