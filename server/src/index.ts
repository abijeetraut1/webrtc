import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import meetingRouter from './module/meetings/router/meeting.route';
import authRouter from './module/auth/router/auth.router';
import { initializeDatabase } from './config/database.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  _add_connected_cache,
  _get_meeting_creator_socket,
  _remove_connected_cache,
  _get_meeting_creator_id,
  _update_connected_device_cache,
  _get_connected_device_data,
} from './cache/meetings.cache';

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use('/api/meetings', meetingRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

interface connectedUsers {
  meetingId: String;
  connectedSockets: [
    {
      socketId: String;
      userId: String;
      userName: String;
      isCreator: String;
    },
  ];
  connectedDevicesCount: Number;
}

io.use((socket, next) => {
  const req = {
    headers: {
      cookie: socket.handshake.headers.cookie,
    },
  } as Request;

  const res = {} as Response;

  cookieParser()(req, res, () => {
    if (!req.cookies.user_id) {
      return next(
        new Error(
          'User ID cookie not found. User must be authenticated to connect to the WebSocket.',
        ),
      );
    }
    socket.data.cookies = req.cookies;
    next();
  });
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  const cookies = socket.data.cookies as { user_id: string };

  socket.on('webrtc:join-request', async (data) => {
    console.log('Received join request:', data);
    try {
      const _get_meeting_details = await _get_meeting_creator_id(
        data.meetingId,
      );

      if (cookies.user_id === _get_meeting_details) {
        await _add_connected_cache(data.meetingId, {
          socketId: socket.id,
          userId: cookies.user_id,
          userName: `hello-world-${cookies.user_id}`,
          isAccepted: true,
        });
      } else {
        await _add_connected_cache(data.meetingId, {
          socketId: socket.id,
          userId: cookies.user_id,
          userName: `hello-world-${cookies.user_id}`,
          isAccepted: false,
        });
      }

      socket.data.meetingId = data.meetingId;
      socket.emit('webrtc:join-response', {
        status: 'REQUEST_SUCCESS',
        message: 'Join request successful.',
      });

      const meetingCreator = await _get_meeting_creator_socket(data.meetingId);
      if (meetingCreator) {
        socket
          .to(meetingCreator.socketId)
          .emit('webrtc:join-acceptence-request', {
            status: 'REQUEST_SUCCESS',
            message: 'Join request successful.',
            data: {
              socketId: socket.id,
              userId: cookies.user_id,
              userName: 'hello world',
            },
          });
      }
    } catch (error) {
      console.error('Error adding user to cache:', error);
      socket.emit('webrtc:join-response', {
        status: 'ERROR',
        message: 'Failed to join the meeting.',
      });
    }
  });

  socket.on('webrtc:join-acceptence-response', async (data) => {
    console.log('Received join acceptance response:', data);
    try {
      const _accepted_user = await _get_connected_device_data(
        data.meetingId,
        data.userId,
      );

      if (!_accepted_user) {
        console.error('Accepted user not found in cache.');
        return;
      }
      console.log('Found accepted user:', _accepted_user);
      await _update_connected_device_cache(data.meetingId, {
        userId: data.userId,
        isAccepted: data.isAccepted,
      });
      console.log('Accepted user data:', _accepted_user);

      socket
        .to(_accepted_user?.socketId)
        .emit('webrtc:join-acceptence-result', {
          status: 'ACCEPTANCE_RESULT',
          message: data,
        });
    } catch (error) {
      console.error('Error updating user acceptance status:', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log('Socket disconnected:', socket.id);
    if (socket.data.meetingId) {
      await _remove_connected_cache(socket.data.meetingId, {
        socketId: socket.id,
        userId: cookies.user_id,
      });
    }
  });
});

initializeDatabase()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
