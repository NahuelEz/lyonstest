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

// Enable detailed logging
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        query: req.query,
        headers: {
            ...req.headers,
            authorization: req.headers.authorization ? '[REDACTED]' : undefined
        }
    });
    next();
});

// CORS configuration
app.use(cors({ 
    origin: [
        "http://127.0.0.1:3000", 
        "http://localhost:9001", 
        "http://localhost:3000", 
        "http://127.0.0.1:5501",
        "http://localhost:5500"
    ],
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/static", express.static(path.join(process.cwd(), "static")));

// Serve templates directory
const templatesPath = path.join(process.cwd(), "templates");
app.use(express.static(templatesPath));

// Template routes
app.get("/", (req, res) => res.sendFile(path.join(templatesPath, "index.html")));
app.get("/tokens", (req, res) => res.sendFile(path.join(templatesPath, "tokens.html")));
app.get("/login", (req, res) => res.sendFile(path.join(templatesPath, "login.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(templatesPath, "dashboard.html")));
app.get("/publish", (req, res) => res.sendFile(path.join(templatesPath, "cargar.html")));
app.get("/coming", (req, res) => res.sendFile(path.join(templatesPath, "coming.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(templatesPath, "profile.html")));
app.get("/model-dashboard", (req, res) => {
    console.log('Serving model dashboard from:', path.join(templatesPath, "model_dashboard.html"));
    res.sendFile(path.join(templatesPath, "model_dashboard.html"));
});

// API routes with authentication
app.use("/api", validateUser, router);
app.use("/api/payment", validateUser, paymentRouter);
app.use("/api/transactions", validateUser, transactionRouter);

// Environment variables endpoint
app.get("/env", (req, res) => {
    res.json({
        API_BASE_URL: process.env.API_BASE_URL || `http://localhost:${SERVER_PORT}`,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Application error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id
    });

    if (err instanceof multer.MulterError || err.message === 'Invalid file type. Only supported image/video formats are allowed.') {
        return res.status(400).send({ 
            success: false, 
            message: err.message, 
            body: null 
        });
    }

    res.status(500).send({ 
        success: false, 
        message: 'Internal server error', 
        body: null 
    });
});

// MIME type middleware
app.use((req, res, next) => {
    if (req.path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
    } else if (req.path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
    }
    next();
});

// Start server
await connection.sync({ force: false }).then(() => {
    app.listen(SERVER_PORT, () => {
        console.log(`Server is running on port http://localhost:${SERVER_PORT}`);
    });
});
