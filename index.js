const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Base de datos temporal
const estadisticas = {};

// Endpoint para registrar un duelo
app.get('/duelo', (req, res) => {
    const { usuario1, usuario2, resultado } = req.query;

    // Validar datos
    if (!usuario1 || !usuario2 || !resultado) {
        return res.status(400).send('Faltan parámetros: usuario1, usuario2 o resultado.');
    }

    // Inicializar estadísticas si no existen
    if (!estadisticas[usuario1]) estadisticas[usuario1] = { ganadas: 0, perdidas: 0, duelos: {} };
    if (!estadisticas[usuario2]) estadisticas[usuario2] = { ganadas: 0, perdidas: 0, duelos: {} };

    // Actualizar estadísticas
    if (resultado === 'ganar') {
        estadisticas[usuario1].ganadas += 1;
        estadisticas[usuario2].perdidas += 1;
    } else {
        estadisticas[usuario1].perdidas += 1;
        estadisticas[usuario2].ganadas += 1;
    }

    // Incrementar número de duelos entre los usuarios
    estadisticas[usuario1].duelos[usuario2] = (estadisticas[usuario1].duelos[usuario2] || 0) + 1;
    estadisticas[usuario2].duelos[usuario1] = (estadisticas[usuario2].duelos[usuario1] || 0) + 1;

    res.send('Estadísticas actualizadas');
});

// Endpoint para consultar estadísticas de un usuario
app.get('/estadisticas', (req, res) => {
    const { usuario } = req.query;

    if (!usuario) {
        return res.status(400).json({ error: 'Se requiere el parámetro "usuario"' });
    }

    if (!estadisticas[usuario]) {
        return res.json({ mensaje: `${usuario} no tiene estadísticas registradas.` });
    }

    const statsUsuario = estadisticas[usuario];
    res.json({
        usuario,
        ganadas: statsUsuario.ganadas,
        perdidas: statsUsuario.perdidas,
        duelos: statsUsuario.duelos
    });
});

// Iniciar el servidor
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
