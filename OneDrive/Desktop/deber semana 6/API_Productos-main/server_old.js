import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuración de variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'api_productos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Ruta para crear un nuevo producto
app.post('/api/products', async (req, res) => {
  const { nombre, precio, existencias } = req.body;

  // Validación básica
  if (!nombre || !precio || !existencias) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio, existencias) VALUES (?, ?, ?)',
      [nombre, precio, existencias]
    );

    const [newProduct] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(newProduct[0]);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Ruta para actualizar un producto
app.put('/api/products/:id', async (req, res) => {
  const { nombre, precio, existencias } = req.body;
  const productId = req.params.id;

  try {
    await pool.query(
      'UPDATE productos SET nombre = ?, precio = ?, existencias = ? WHERE id = ?',
      [nombre, precio, existencias, productId]
    );

    const [updatedProduct] = await pool.query('SELECT * FROM productos WHERE id = ?', [productId]);
    res.json(updatedProduct[0]);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Ruta para eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API REST corriendo en http://localhost:${PORT}`);
});