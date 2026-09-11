"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports._get_connected_device_data = exports._get_meeting_creator_id = exports._get_meeting_creator_socket = exports._update_connected_device_cache = exports._remove_connected_cache = exports._add_connected_cache = exports._create_meeting_cache = void 0;
var connectedMeetings = new Map();
function _create_meeting_cache(meetingId, creatorId, expiresAt, isAutoExpires) {
    return __awaiter(this, void 0, void 0, function () {
        var _get_connected_meetings;
        return __generator(this, function (_a) {
            _get_connected_meetings = connectedMeetings.get(meetingId);
            if (!_get_connected_meetings) {
                connectedMeetings.set(meetingId, {
                    meetingId: meetingId,
                    creatorId: creatorId,
                    connectedSockets: []
                });
                return [2 /*return*/, true];
            }
            else {
                if (isAutoExpires === false) {
                    throw new Error('Meeting already exists and is set to never expire.');
                }
                if (_get_connected_meetings.connectedSockets.length === 0) {
                    if (expiresAt.getTime() > Date.now()) {
                        connectedMeetings["delete"](meetingId);
                        connectedMeetings.set(meetingId, {
                            meetingId: meetingId,
                            creatorId: creatorId,
                            connectedSockets: []
                        });
                        return [2 /*return*/, true];
                    }
                }
            }
            return [2 /*return*/, false];
        });
    });
}
exports._create_meeting_cache = _create_meeting_cache;
function _add_connected_cache(meetingId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _get_connected_meetings, _find_existing_socket_storage;
        return __generator(this, function (_a) {
            _get_connected_meetings = connectedMeetings.get(meetingId);
            if (!_get_connected_meetings) {
                throw new Error('Meeting not found in cache.');
            }
            _find_existing_socket_storage = _get_connected_meetings.connectedSockets.find(function (element) { return element.userId === data.userId; });
            if (!_find_existing_socket_storage) {
                _get_connected_meetings.connectedSockets.push(data);
            }
            else {
                _find_existing_socket_storage.socketId = data.socketId;
                _find_existing_socket_storage.userName = data.userName;
            }
            return [2 /*return*/, _get_connected_meetings];
        });
    });
}
exports._add_connected_cache = _add_connected_cache;
function _remove_connected_cache(meetingId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _get_connected_meetings, connectedSocket;
        return __generator(this, function (_a) {
            _get_connected_meetings = connectedMeetings.get(meetingId);
            if (!_get_connected_meetings) {
                return [2 /*return*/, undefined];
            }
            connectedSocket = _get_connected_meetings.connectedSockets.find(function (socket) {
                return socket.socketId === data.socketId && socket.userId === data.userId;
            });
            if (connectedSocket) {
                connectedSocket.socketId = '';
            }
            return [2 /*return*/, _get_connected_meetings];
        });
    });
}
exports._remove_connected_cache = _remove_connected_cache;
exports._update_connected_device_cache = function (meetingId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var _get_connected_meetings, _find_existing_socket_storage;
    return __generator(this, function (_a) {
        _get_connected_meetings = connectedMeetings.get(meetingId);
        if (!_get_connected_meetings) {
            throw new Error('Meeting not found in cache.');
        }
        _find_existing_socket_storage = _get_connected_meetings.connectedSockets.find(function (element) { return element.userId === data.userId; });
        if (_find_existing_socket_storage) {
            _find_existing_socket_storage.isAccepted = data.isAccepted;
        }
        return [2 /*return*/, _get_connected_meetings];
    });
}); };
exports._get_meeting_creator_socket = function (meetingId) { return __awaiter(void 0, void 0, void 0, function () {
    var _get_connected_meetings, _creator_socket;
    return __generator(this, function (_a) {
        _get_connected_meetings = connectedMeetings.get(meetingId);
        if (!_get_connected_meetings) {
            return [2 /*return*/, undefined];
        }
        console.log(JSON.stringify(_get_connected_meetings));
        _creator_socket = _get_connected_meetings.connectedSockets.find(function (socket) {
            return _get_connected_meetings.creatorId === socket.userId &&
                socket.socketId.length > 0;
        });
        return [2 /*return*/, _creator_socket];
    });
}); };
exports._get_meeting_creator_id = function (meetingId) { return __awaiter(void 0, void 0, void 0, function () {
    var _get_connected_meetings;
    return __generator(this, function (_a) {
        _get_connected_meetings = connectedMeetings.get(meetingId);
        if (!_get_connected_meetings) {
            return [2 /*return*/, undefined];
        }
        return [2 /*return*/, _get_connected_meetings.creatorId];
    });
}); };
exports._get_connected_device_data = function (meetingId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var _get_connected_meetings, _find_existing_socket_storage;
    return __generator(this, function (_a) {
        _get_connected_meetings = connectedMeetings.get(meetingId);
        if (!_get_connected_meetings) {
            return [2 /*return*/, undefined];
        }
        _find_existing_socket_storage = _get_connected_meetings.connectedSockets.find(function (element) { return element.userId === userId; });
        console.log('FIND EXISTING SOCKET STORAGE: ', _find_existing_socket_storage, ' user_id ', userId);
        return [2 /*return*/, _find_existing_socket_storage];
    });
}); };
