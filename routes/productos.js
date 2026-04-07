const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  const { nombre, categoria, precio, stock, descripcion, fechaVencimiento } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, categoria, precio, stock, descripcion, fechaVencimiento) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, categoria, precio, stock, descripcion, fechaVencimiento]
    );
    
    res.json({ 
      id: result.insertId, 
      message: 'Producto creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion, fechaVencimiento } = req.body;
  
  try {
    await db.query(
      'UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, descripcion=?, fechaVencimiento=? WHERE id=?',
      [nombre, categoria, precio, stock, descripcion, fechaVencimiento, id]
    );
    
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM productos WHERE id=?', [id]);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
