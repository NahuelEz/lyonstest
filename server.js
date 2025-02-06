import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import router from "./server/routes/index.js";
import paymentRouter from "./server/routes/payments.router.js";
import { SERVER_PORT } from "./config/config.js";
import connection from "./server/connection/connection.js";
import transactionRouter from "./server/routes/transactions.router.js";
import { validateUser } from "./server/middlewares/user.validator.js";
import multer from "multer";

dotenv.config();

const PORT = process.env.PORT || 9001;
const app = express();

app.use(cors({ 
  origin: [
    "http://127.0.0.1:3000", 
    "http://localhost:9001", 
    "http://localhost:3000", 
    "http://127.0.0.1:5501", // Agregado para Live Server
    "http://localhost:5500"// Agregado para Live Server
    
  ] 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/static", express.static(path.join(process.cwd(), "static")));
app.use(express.static("./templates")); // Sirviendo la carpeta templates


// Rutas para templates
const templatesPath = path.join(process.cwd(), "templates");
app.get("/", (req, res) => res.sendFile(path.join(templatesPath, "index.html")));
app.get("/tokens", (req, res) => res.sendFile(path.join(templatesPath, "tokens.html")));
app.get("/login", (req, res) => res.sendFile(path.join(templatesPath, "login.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(templatesPath, "dashboard.html")));
app.get("/publish", (req, res) => res.sendFile(path.join(templatesPath, "cargar.html")));
app.get("/coming", (req, res) => res.sendFile(path.join(templatesPath, "coming.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(templatesPath, "profile.html")));

// API routes
app.use("/api", validateUser, router);
app.use("/api/payment", paymentRouter);
app.use("/api/transactions", transactionRouter);

// Ruta para devolver variables de entorno
app.get("/env", (req, res) => {
  res.json({
    API_BASE_URL: process.env.API_BASE_URL || `http://localhost:${SERVER_PORT}`,
  })
});

app.use((err, req, res, next) => {
  console.log(err)
  if (err instanceof multer.MulterError || err.message == 'Invalid file type. Only supported image/video formats are allowed.') {
    return res.status(400).send({ success: false, message: err.message, body: null });
  }
  next(err);
});

// Middleware para tipo MIME
app.use((req, res, next) => {
  if (req.path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (req.path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// Iniciar el servidor y sincronizar la base de datos
await connection.sync({ force: false }).then(() => {
  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port http://localhost:${SERVER_PORT}`);
  });
});

