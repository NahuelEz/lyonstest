const MODE = process.env.MODE || ""
const SERVER_PORT = process.env.SERVER_PORT || "9001"
const DB_NAME = process.env.DB_NAME || "u210318420_lyonsvip"
const DB_USER = process.env.DB_USER || "u210318420_administracion"
const DB_PASSWORD = process.env.DB_PASSWORD || "123400!!Dolphin!!"
const DB_HOST = process.env.DB_HOST || "193.203.175.92"
const DB_PORT = process.env.DB_PORT || "3306"
const DB_DIALECT = process.env.DB_DIALECT || "mysql"
const SECRET = process.env.SECERT || ""
const JWT_SECRET = process.env.JWT_SECRET || "randomsecretkey"
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dtwf3e8ph"
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "561921121383111"
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "eL05VCrjZCK1t3QvqMO1Eo1RWXo"

export {
    SERVER_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DIALECT,
    SECRET,
    MODE,
    JWT_SECRET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
}