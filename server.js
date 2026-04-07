const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

// Importar rutas
const consultaRoutes = require('./routes/consulta');
const productosRoutes = require('./routes/productos');

app.use('/api/consulta', consultaRoutes);
app.use('/api/productos', productosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});