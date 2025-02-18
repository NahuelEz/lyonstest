import { Router } from "express";
import CommentController from "../controllers/comment.controller.js";
import { validateUser } from "../middlewares/user.validator.js"; // Middleware existente
import Comment from "../models/Comment.js";

const commentRouter = Router();

// Ruta para agregar comentarios
commentRouter.post("/:id/comment", validateUser, CommentController.addComment);

// Ruta para obtener comentarios de una publicación
commentRouter.get("/:id/comments", validateUser, async (req, res) => {
    try {
        const { id: publicationId } = req.params; // Cambia "id" para mayor claridad
        const comments = await Comment.findAll({
            where: { publicationId },
            attributes: ["id", "content", "userId", "createdAt"],
            include: [
                {
                    model: User, // Incluye datos del usuario
                    attributes: ["id", "username", "profileImage"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ success: true, body: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default commentRouter;
