require('dotenv').config();
const express = require("express");
const { sql, poolPromise } = require("./dbsql.js");
const cors = require("cors");
const mongoose = require("mongoose");

const rolRoutes = require("./sql/routes/roleRoutes.js");
const userRoutes = require('./sql/routes/userRoutes.js');
const donanteRoutes = require('./sql/routes/donanteRoutes.js');
const campanaRoutes = require('./sql/routes/campanaRoutes.js')
const almacenRoutes = require('./sql/routes/almacenRoutes.js'); 
const categoriaDeArticuloRoutes = require('./sql/routes/categoriaArticuloRoutes.js');
const catalogoDeArticuloRoutes = require('./sql/routes/catalogoArticuloRoutes.js');
const donacionesRoutes = require('./sql/routes/donacionesRoutes.js');
const donacionesEnDineroRoutes = require('./sql/routes/donacionesDineroRoutes.js');
const donacionesEnEspecieRoutes = require('./sql/routes/donacionesEspecieRoutes.js');
const puntosDeRecoleccionRoutes = require('./sql/routes/puntosRecoleccionRoutes.js');
const pedidosDeAyudaRoutes = require('./sql/routes/pedidosAyudaRoutes.js');
const authRoutes = require('./sql/routes/userAuthRoutes');
const donanteAuthRoutes = require('./sql/routes/donanteAuthRoutes');
const estanteRoutes = require('./sql/routes/estanteRoutes.js');
const espacioRoutes = require('./sql/routes/espacioRoutes.js');
const dashboard = require('./sql/routes/dashboardRoutes.js')
const inventarioRoutes = require('./sql/routes/inventarioRoutes.js');
const uploadRoutes = require('./mongo/routes/uploadRoutes.js');
const unidadesRoutes = require('./sql/routes/unidadesRoutes.js');
const donacionesRopaRoutes = require('./sql/routes/donacionesRopaRoutes.js');
const solicitudesRecoleccion = require('./sql/routes/solicitudesRecoleccionRoutes.js')
const paquetes = require('./sql/routes/paquetesRoutes.js')
const reportes = require('./sql/routes/reportesRoutes.js')
const imagenesCampanasRoutes = require('./mongo/routes/imagenesCampanasRoutes.js');
const cajasRoutes = require('./sql/routes/cajasRoutes.js');
const imagenesCiRoutes = require('./mongo/routes/imagenesCiRoutes.js');
const imagenesSolicitudRecogidaRoutes = require('./mongo/routes/imagenSolicitudRecogida.js');
const salidasAlmacenRoutes = require('./sql/routes/salidasAlmacenRoutes.js');
const historialMovimientosRoutes = require('./sql/routes/historialMovimientosRoutes.js')

const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001', 'https://front-donaciones.vercel.app', 'http://localhost:3000', 'http://alas-front.local', 'http://dona-front.local', 'http://das-front.local', 'http://ani-front.local', 'http://gevopi.local', 'http://sipi-front.local', 'http://alas-front.local', 'http://auto-front.local', 'http://traz-front.local', 'https://front-donaciones-o9bs.vercel.app', 'https://alas-chiquitanas-donaciones.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado'))
  .catch(err => console.error('❌ Error al conectar MongoDB Atlas:', err));

app.use("/api/roles", rolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donantes', donanteRoutes);
app.use('/api/campanas', campanaRoutes);
app.use('/api/almacenes', almacenRoutes);
app.use('/api/categorias', categoriaDeArticuloRoutes);
app.use('/api/catalogo', catalogoDeArticuloRoutes);
app.use('/api/donaciones', donacionesRoutes);
app.use('/api/donaciones-en-dinero', donacionesEnDineroRoutes);
app.use('/api/donaciones-en-especie', donacionesEnEspecieRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/puntos-de-recoleccion', puntosDeRecoleccionRoutes);
app.use('/api/pedidos-de-ayuda', pedidosDeAyudaRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/donante-auth', donanteAuthRoutes);
app.use('/api/estantes', estanteRoutes);
app.use('/api/espacios', espacioRoutes);
app.use('/api/dashboard', dashboard)
app.use('/api', uploadRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/donacionesRopa', donacionesRopaRoutes);
app.use('/api/solicitudesRecoleccion', solicitudesRecoleccion);
app.use('/api/paquetes', paquetes)
app.use('/api/reportes', reportes)
app.use('/api/imagenes-campanas', imagenesCampanasRoutes)
app.use('/api/imagenes-ci', imagenesCiRoutes);
app.use('/api/imagenes-solicitud-recogida', imagenesSolicitudRecogidaRoutes);
app.use('/api/cajas', cajasRoutes);
app.use('/api/salidas-almacen', salidasAlmacenRoutes);
app.use('/api/historial-movimientos', historialMovimientosRoutes);


poolPromise.then(pool => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Error en la conexión a la base de datos:", err);
});


