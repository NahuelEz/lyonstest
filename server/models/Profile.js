import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Profile extends Model { }

Profile.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Please enter your first name",
                },
                len: {
                    args: [3, 64],
                    msg: "The first name must be between 3 and 64 characters.",
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Please enter your last name",
                },
                len: {
                    args: [2, 128],
                    msg: "The last name must be between 2 and 128 characters.",
                }
            }
        },
        sex: {
            type: DataTypes.ENUM("m", "f", "o"),
            allowNull: false
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: "Invalid date",
                },
                isBefore: {
                    args: new Date().toISOString().split("T")[0],
                    msg: "The date of birth must be before the current date",
                }
            }
        },
        document: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        residenceCountry: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        residenceCity: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        frontDocument: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        backDocument: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        videoDocument: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        publicUserName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false,
            unique: {
                name: "username",
                msg: "The current public username already exist",
            },
            validate: {
                notEmpty: {
                    msg: "Invalid username",
                },
                len: {
                    args: [3, 12],
                    msg: "The username must be between 3 and 12 characters",
                }
            }
            
        },
        stageName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        posterImage: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        bannerImage: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        basicSubscriptionCost: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 15
        }
    },
    {
        sequelize: connection,
        modelName: "profile",
        timestamps: false,
    }
);


export default Profile;

