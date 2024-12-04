// server.mjs

import express from 'express'; // Importamos Express
import http from 'http'; // Importamos HTTP
import { Server } from 'socket.io'; // Importamos Socket.IO
import { nanoid } from 'nanoid'; // Importamos nanoid (para generar IDs únicos)

const app = express(); // Creamos una instancia de la aplicación Express
const server = http.createServer(app); // Creamos el servidor HTTP a partir de Express
const io = new Server(server); // Creamos una instancia de Socket.IO usando el servidor HTTP

// Ruta básica para probar el servidor
app.get('/', (req, res) => {
  res.send('¡Bienvenido al juego de UNO!');
});

// Variable para el puerto (sin especificar un puerto fijo)
const PORT = process.env.PORT || 3000;  // Usamos la variable de entorno PORT si está disponible (en plataformas como Heroku), o 3000 por defecto

// Eventos de Socket.IO para manejar la lógica del juego
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Crear sala
  socket.on('create-room', (data, callback) => {
    const roomId = nanoid(); // Usamos nanoid para crear un ID único para la sala
    socket.join(roomId); // El jugador se une a la sala creada
    callback(roomId); // Devolvemos el ID de la sala al cliente para que lo compartan
    console.log(`Sala creada con ID: ${roomId}`);
  });

  // Unirse a una sala
  socket.on('join-room', (roomId) => {
    socket.join(roomId); // El jugador se une a la sala
    console.log(`Usuario se unió a la sala: ${roomId}`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Hacemos que el servidor escuche en el puerto configurado
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});