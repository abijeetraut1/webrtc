"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var database_config_1 = require("../../../config/database.config");
var ConnectedDevice = database_config_1["default"].define('ConnectedDevice', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    meetingId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isAccepted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'connected_devices',
    timestamps: true,
    indexes: [
        {
            name: 'connected_devices_meeting_user_unique',
            unique: true,
            fields: ['meetingId', 'userId']
        },
    ]
});
exports["default"] = ConnectedDevice;
