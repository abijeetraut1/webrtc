import { DataTypes } from 'sequelize';

import sequelize from '../../../config/database.config';

export const UNIQUE_MEETING_CONSTRAINT = 'meetings_user_id_code_unique';

const Meeting = sequelize.define("Meeting", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        meetingCode: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },

        isPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        
        meetingName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        autoExpires: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "meetings",
        timestamps: true,
        paranoid: true,
        indexes: [{
            name: UNIQUE_MEETING_CONSTRAINT,
            unique: true,
            fields: ["userId", "meetingCode"],
        }],

        hooks: {
            beforeValidate: (meeting) => {
                if (!meeting.get("meetingName")) {
                    meeting.set("meetingName", meeting.get("meetingCode"));
                }
            },
        },
    }
);

export default Meeting;