import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Pool de conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'api_productos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// ================== PRODUCTOS ==================

// LISTAR todos los productos (incluye nombre de categoría)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.IdProducto,
        p.CodigoBarra,
        p.Nombre,
        p.categoria_id,
        c.nombre AS Categoria,
        p.Marca,
        p.Precio
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.IdProducto
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// OBTENER un producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.IdProducto,
        p.CodigoBarra,
        p.Nombre,
        p.categoria_id,
        c.nombre AS Categoria,
        p.Marca,
        p.Precio
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.IdProducto = ?
      `,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// CREAR producto
app.post('/api/products', async (req, res) => {
  const { CodigoBarra, Nombre, categoria_id, Marca, Precio } = req.body;

  if (!Nombre || Precio == null) {
    return res
      .status(400)
      .json({ error: 'Nombre y Precio son campos requeridos' });
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO productos
        (CodigoBarra, Nombre, categoria_id, Marca, Precio)
      VALUES (?, ?, ?, ?, ?)
      `,
      [CodigoBarra || null, Nombre, categoria_id || null, Marca || null, Precio],
    );

    const insertId = result.insertId;

    const [rows] = await pool.query(
      `
      SELECT 
        p.IdProducto,
        p.CodigoBarra,
        p.Nombre,
        p.categoria_id,
        c.nombre AS Categoria,
        p.Marca,
        p.Precio
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.IdProducto = ?
      `,
      [insertId],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// ACTUALIZAR producto
app.put('/api/products/:id', async (req, res) => {
  const { CodigoBarra, Nombre, categoria_id, Marca, Precio } = req.body;
  const id = req.params.id;

  if (!Nombre || Precio == null) {
    return res
      .status(400)
      .json({ error: 'Nombre y Precio son campos requeridos' });
  }

  try {
    await pool.query(
      `
      UPDATE productos
      SET CodigoBarra = ?, Nombre = ?, categoria_id = ?, Marca = ?, Precio = ?
      WHERE IdProducto = ?
      `,
      [CodigoBarra || null, Nombre, categoria_id || null, Marca || null, Precio, id],
    );

    const [rows] = await pool.query(
      `
      SELECT 
        p.IdProducto,
        p.CodigoBarra,
        p.Nombre,
        p.categoria_id,
        c.nombre AS Categoria,
        p.Marca,
        p.Precio
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.IdProducto = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ELIMINAR producto
app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE IdProducto = ?', [
      req.params.id,
    ]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});


// ================== CATEGORÍAS ==================

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre FROM categorias');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

app.post('/api/categories', async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre],
    );

    res.status(201).json({ id: result.insertId, nombre });
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});


// ============== MIDDLEWARES GENERALES ==============

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor API REST corriendo en http://0.0.0.0:${PORT}`);
});
