const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas CRUD para usuarios

// GET - Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios ORDER BY fecha_creacion DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET - Obtener usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST - Crear nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;
        
        if (!nombre || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y email son requeridos'
            });
        }
        
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)',
            [nombre, email, telefono || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                id: result.insertId,
                nombre,
                email,
                telefono
            }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
});

// PUT - Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono } = req.body;
        
        if (!nombre || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y email son requeridos'
            });
        }
        
        const [result] = await db.execute(
            'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
            [nombre, email, telefono || null, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: '🏦 API de Gestión de Usuarios - Banca Virtual',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            health: '/health'
        },
        status: 'Servidor funcionando correctamente'
    });
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api/usuarios',
            'GET /api/usuarios/:id',
            'POST /api/usuarios',
            'PUT /api/usuarios/:id',
            'DELETE /api/usuarios/:id'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Accede a: http://localhost:${PORT}/`);
    console.log(`API disponible en: http://localhost:${PORT}/api/usuarios`);
});



