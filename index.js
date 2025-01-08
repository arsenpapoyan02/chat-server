import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

import { registerValidation, loginValidation } from './validations/auth.js';
import { messageCreateValidation } from './validations/message.js';

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import { MessageController, UserController } from './controllers/index.js';

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "https://arsenpapoyan02-realtime-chat.netlify.app",
        methods: ["GET", "POST", "DELETE"]
    }
});

mongoose
    .connect(`mongodb://127.0.0.1:27017/crud`)
    .then(() => console.log("db is ok"))
    .catch(err => console.log('db error', err))

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/messages', checkAuth, MessageController.getAll)
app.get('/messages/:id', checkAuth, MessageController.getById)
app.post('/messages', checkAuth, messageCreateValidation, handleValidationErrors, MessageController.create)
app.delete('/messages/:id', checkAuth, MessageController.remove)

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data); // Отправляем сообщение всем, кроме отправителя
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`))