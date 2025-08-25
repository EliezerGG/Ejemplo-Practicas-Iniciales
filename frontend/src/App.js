import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({
    id: '',
    nombre: '',
    email: '',
    telefono: ''
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setMensaje('Error al cargar usuarios');
    }
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editando 
        ? `${API_URL}/usuarios/${formulario.id}`
        : `${API_URL}/usuarios`;
      
      const method = editando ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formulario.nombre,
          email: formulario.email,
          telefono: formulario.telefono
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMensaje(data.message);
        limpiarFormulario();
        cargarUsuarios();
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al procesar la solicitud');
    }
  };

  const editarUsuario = (usuario) => {
    setFormulario({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono || ''
    });
    setEditando(true);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          setMensaje(data.message);
          cargarUsuarios();
        } else {
          setMensaje(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setMensaje('Error al eliminar usuario');
      }
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: '',
      nombre: '',
      email: '',
      telefono: ''
    });
    setEditando(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 Sistema de Gestión de Usuarios - Banca Virtual</h1>
        
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'exito'}`}>
            {mensaje}
          </div>
        )}

        <div className="contenedor">
          {/* Formulario */}
          <div className="formulario-seccion">
            <h2>{editando ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
            <form onSubmit={manejarSubmit} className="formulario">
              <div className="campo">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>
              
              <div className="campo">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  required
                />
              </div>
              
              <div className="campo">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                />
              </div>
              
              <div className="botones">
                <button type="submit" className="btn-primary">
                  {editando ? 'Actualizar' : 'Crear'} Usuario
                </button>
                {editando && (
                  <button type="button" onClick={limpiarFormulario} className="btn-secondary">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de usuarios */}
          <div className="lista-seccion">
            <h2>Lista de Usuarios ({usuarios.length})</h2>
            {usuarios.length > 0 ? (
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono || 'N/A'}</td>
                        <td>
                          <button 
                            onClick={() => editarUsuario(usuario)}
                            className="btn-editar"
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            onClick={() => eliminarUsuario(usuario.id)}
                            className="btn-eliminar"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sin-datos">
                <p>No hay usuarios registrados</p>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;