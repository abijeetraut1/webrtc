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
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var meeting_route_1 = require("./module/meetings/router/meeting.route");
var auth_router_1 = require("./module/auth/router/auth.router");
var database_config_1 = require("./config/database.config");
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
var meetings_cache_1 = require("./cache/meetings.cache");
var app = express_1["default"]();
var PORT = 8080;
var allowedOrigins = ['http://localhost:5173', 'http://localhost:5173'];
app.use(cookie_parser_1["default"]());
app.use(express_1["default"].json());
app.use(cors_1["default"]({
    origin: 'http://localhost:5173',
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use('/api/meetings', meeting_route_1["default"]);
app.use('/api/auth', auth_router_1["default"]);
app.get('/', function (req, res) {
    res.json({ status: 'ok', message: 'Server is running' });
});
var httpServer = http_1.createServer(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
io.use(function (socket, next) {
    var req = {
        headers: {
            cookie: socket.handshake.headers.cookie
        }
    };
    var res = {};
    cookie_parser_1["default"]()(req, res, function () {
        if (!req.cookies.user_id) {
            return next(new Error('User ID cookie not found. User must be authenticated to connect to the WebSocket.'));
        }
        socket.data.cookies = req.cookies;
        next();
    });
});
io.on('connection', function (socket) {
    console.log('Socket connected:', socket.id);
    var cookies = socket.data.cookies;
    socket.on('webrtc:join-request', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var _get_meeting_details, meetingCreator, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Received join request:', data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, meetings_cache_1._get_meeting_creator_id(data.meetingId)];
                case 2:
                    _get_meeting_details = _a.sent();
                    if (!(cookies.user_id === _get_meeting_details)) return [3 /*break*/, 4];
                    return [4 /*yield*/, meetings_cache_1._add_connected_cache(data.meetingId, {
                            socketId: socket.id,
                            userId: cookies.user_id,
                            userName: "hello-world-" + cookies.user_id,
                            isAccepted: true
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, meetings_cache_1._add_connected_cache(data.meetingId, {
                        socketId: socket.id,
                        userId: cookies.user_id,
                        userName: "hello-world-" + cookies.user_id,
                        isAccepted: false
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    socket.data.meetingId = data.meetingId;
                    socket.emit('webrtc:join-response', {
                        status: 'REQUEST_SUCCESS',
                        message: 'Join request successful.'
                    });
                    return [4 /*yield*/, meetings_cache_1._get_meeting_creator_socket(data.meetingId)];
                case 7:
                    meetingCreator = _a.sent();
                    if (meetingCreator) {
                        socket
                            .to(meetingCreator.socketId)
                            .emit('webrtc:join-acceptence-request', {
                            status: 'REQUEST_SUCCESS',
                            message: 'Join request successful.',
                            data: {
                                socketId: socket.id,
                                userId: cookies.user_id,
                                userName: 'hello world'
                            }
                        });
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error adding user to cache:', error_1);
                    socket.emit('webrtc:join-response', {
                        status: 'ERROR',
                        message: 'Failed to join the meeting.'
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    socket.on('webrtc:join-acceptence-response', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var _accepted_user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Received join acceptance response:', data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, meetings_cache_1._get_connected_device_data(data.meetingId, data.userId)];
                case 2:
                    _accepted_user = _a.sent();
                    if (!_accepted_user) {
                        console.error('Accepted user not found in cache.');
                        return [2 /*return*/];
                    }
                    console.log('Found accepted user:', _accepted_user);
                    return [4 /*yield*/, meetings_cache_1._update_connected_device_cache(data.meetingId, {
                            userId: data.userId,
                            isAccepted: data.isAccepted
                        })];
                case 3:
                    _a.sent();
                    socket
                        .to(_accepted_user === null || _accepted_user === void 0 ? void 0 : _accepted_user.socketId)
                        .emit('webrtc:join-acceptence-result', {
                        status: 'ACCEPTANCE_RESULT',
                        message: data
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error updating user acceptance status:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    socket.on('webrtc:join-answer', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var meetingCreator, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, meetings_cache_1._get_meeting_creator_socket(data.meetingId)];
                case 1:
                    meetingCreator = _a.sent();
                    if (meetingCreator) {
                        socket.to(meetingCreator.socketId).emit('webrtc:join-answer', {
                            sdpAnswer: data.sdpAnswer
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error forwarding join answer:', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Socket disconnected:', socket.id);
                    if (!socket.data.meetingId) return [3 /*break*/, 2];
                    return [4 /*yield*/, meetings_cache_1._remove_connected_cache(socket.data.meetingId, {
                            socketId: socket.id,
                            userId: cookies.user_id
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
database_config_1.initializeDatabase()
    .then(function () {
    httpServer.listen(PORT, '0.0.0.0', function () {
        console.log("Server listening on http://localhost:" + PORT);
    });
})["catch"](function () {
    process.exit(1);
});
