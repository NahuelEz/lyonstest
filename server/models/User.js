import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import bcrypt from "bcrypt";

class User extends Model {
    validatePassword = async (plainTextPassword) => {
        const validate = await bcrypt.hash(plainTextPassword, this.salt);
        return validate === this.password;
    };
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: "email",
                msg: "The entered email already exists, choose another one",
            },
            validate: {
                isEmail: {
                    msg: "The email entered is invalid.",
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Invalid password.",
                },
                len: {
                    args: [8, 255],
                    msg: "La clave debe tener al menos 8 caracteres.",
                },
                is: {
                    args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                    msg: "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
                }
            }
        },
        status: {
            type: DataTypes.ENUM("unverified", "verified", "deleted"),
            allowNull: false,
            defaultValue: "unverified"
        },
        role: {
            type: DataTypes.ENUM("model", "user"),
            allowNull: false,
            defaultValue: "user"
        },
        profileComplete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: "Invalid date",
                }
            }
        },
        tokens: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        salt: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: connection,
        modelName: "user",
        timestamps: false,
    }
);

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt();
    user.salt = salt;

    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
});

export default User;

