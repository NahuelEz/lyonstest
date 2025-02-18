import { Router } from "express";
import CommentController from "../controllers/comment.controller.js";
import { validateUser } from "../middlewares/user.validator.js";

const commentRouter = Router();

// Ruta para agregar comentarios
commentRouter.post("/:id/comment", validateUser, CommentController.addComment);

// Ruta para obtener comentarios de una publicación
commentRouter.get("/:id/comments", validateUser, CommentController.getComments);

export default commentRouter;
