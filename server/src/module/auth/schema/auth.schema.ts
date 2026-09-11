import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.config";

export const UNIQUE_EMAIL_CONSTRAINT = "users_email_unique";

const User = sequelize.define("User", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: UNIQUE_EMAIL_CONSTRAINT,
			validate: {
				isEmail: true,
				contains: "@gmail.com"
            },
		},
        hasAccountSetup: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
		otp: {
			type: DataTypes.STRING,
			allowNull: true,
		},
        isRestricted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        restrictedReason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
		otpExpires: {
			type: DataTypes.DATE,
			allowNull: true,
		}
	},
	{
		tableName: "users",
		timestamps: true,
	}
);

export default User;
