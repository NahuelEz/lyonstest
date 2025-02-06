import { Router } from "express";
import CommentController from "../controllers/comment.controller.js";
import { validateUser } from "../middlewares/user.validator.js"; // Middleware existente

const commentRouter = Router();

// Proteger las rutas con validateUser
commentRouter.post("/:id/comment", validateUser, CommentController.addComment);
commentRouter.get("/:id/comments", validateUser, CommentController.getComments);

export default commentRouter;
