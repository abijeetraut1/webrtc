import { promises as fs } from 'fs';
import path from 'path';

const connectedMeetings = new Map<string, connectedUsers>();
const connectedMeetingsFile = path.resolve(
  __dirname,
  '../../data/connected-meetings.json',
);

interface connectedUsers {
  meetingId: string;
  creatorId: string;
  connectedSockets: {
    socketId: string;
    userId: string;
    userName: string;
    isAccepted: boolean;
  }[];
}

interface addConnectedUsers {
  socketId: string;
  userId: string;
  userName: string;
  isAccepted: boolean;
}

interface updateConnectedUsers {
  userId: string;
  isAccepted: boolean;
}

interface removeConnectedUsers {
  socketId: string;
  userId: string;
}

export async function _create_meeting_cache(
  meetingId: string,
  creatorId: string,
  expiresAt: Date,
  isAutoExpires: boolean,
) {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    connectedMeetings.set(meetingId, {
      meetingId: meetingId,
      creatorId: creatorId,
      connectedSockets: [],
    });
    await _save_connected_cache();

    return true;
  } else {
    if (isAutoExpires === false) {
      throw new Error('Meeting already exists and is set to never expire.');
    }

    if (_get_connected_meetings.connectedSockets.length === 0) {
      if (expiresAt.getTime() > Date.now()) {
        connectedMeetings.delete(meetingId);
        connectedMeetings.set(meetingId, {
          meetingId: meetingId,
          creatorId: creatorId,
          connectedSockets: [],
        });
        await _save_connected_cache();

        return true;
      }
    }
  }

  return false;
}

export async function _add_connected_cache(
  meetingId: string,
  data: addConnectedUsers,
) {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    throw new Error('Meeting not found in cache.');
  }

  const _find_existing_socket_storage =
    _get_connected_meetings.connectedSockets.find(
      (element) => element.userId === data.userId,
    );

  if (!_find_existing_socket_storage) {
    _get_connected_meetings.connectedSockets.push(data);
  } else {
    _find_existing_socket_storage.socketId = data.socketId;
    _find_existing_socket_storage.userName = data.userName;
  }

  await _save_connected_cache();
  return _get_connected_meetings;
}

export async function _remove_connected_cache(
  meetingId: string,
  data: removeConnectedUsers,
) {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    return undefined;
  }

  const connectedSocket = _get_connected_meetings.connectedSockets.find(
    (socket) =>
      socket.socketId === data.socketId && socket.userId === data.userId,
  );

  if (connectedSocket) {
    connectedSocket.socketId = '';
    await _save_connected_cache();
  }

  return _get_connected_meetings;
}

export const _update_connected_device_cache = async (
  meetingId: string,
  data: updateConnectedUsers,
) => {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    throw new Error('Meeting not found in cache.');
  }

  const _find_existing_socket_storage =
    _get_connected_meetings.connectedSockets.find(
      (element) => element.userId === data.userId,
    );

  if (_find_existing_socket_storage) {
    _find_existing_socket_storage.isAccepted = data.isAccepted;
    await _save_connected_cache();
  }

  return _get_connected_meetings;
};

export const _get_meeting_creator_socket = async (meetingId: string) => {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    return undefined;
  }

  console.log(JSON.stringify(_get_connected_meetings));
  const _creator_socket = _get_connected_meetings.connectedSockets.find(
    (socket) =>
      _get_connected_meetings.creatorId === socket.userId &&
      socket.socketId.length > 0,
  );

  return _creator_socket;
};

export async function _load_connected_cache() {
  try {
    const file = await fs.readFile(connectedMeetingsFile, 'utf8');
    const savedMeetings = JSON.parse(file) as connectedUsers[];

    connectedMeetings.clear();
    for (const meeting of savedMeetings) {
      connectedMeetings.set(meeting.meetingId, meeting);
    }
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

async function _save_connected_cache() {
  await fs.mkdir(path.dirname(connectedMeetingsFile), { recursive: true });
  await fs.writeFile(
    connectedMeetingsFile,
    JSON.stringify([...connectedMeetings.values()], null, 2),
    'utf8',
  );
}

export const _get_meeting_creator_id = async (meetingId: string) => {
  const _get_connected_meetings = connectedMeetings.get(meetingId);

  if (!_get_connected_meetings) {
    return undefined;
  }

  return _get_connected_meetings.creatorId;
};

export const _get_connected_device_data = async (
  meetingId: string,
  userId: string,
) => {
  const _get_connected_meetings = connectedMeetings.get(meetingId);
  if (!_get_connected_meetings) {
    return undefined;
  }

  const _find_existing_socket_storage =
    _get_connected_meetings.connectedSockets.find(
      (element) => element.userId === userId,
    );

  console.log(
    'FIND EXISTING SOCKET STORAGE: ',
    _find_existing_socket_storage,
    ' user_id ',
    userId,
  );
  return _find_existing_socket_storage;
};
