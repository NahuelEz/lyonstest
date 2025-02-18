import { Router } from "express";
import LikeController from "../controllers/like.controller.js";
import { validateUser } from "../middlewares/user.validator.js"; 
import { Like } from "../models/index.js";
const likeRouter = Router();

likeRouter.post("/:id/like", validateUser, LikeController.likePublication);
likeRouter.get("/:id/count", async (req, res) => {
    try {
        const { id: publicationId } = req.params;

        // Cuenta los "likes" asociados a la publicación
        const likesCount = await Like.count({ where: { publicationId } });

        res.status(200).json({ success: true, body: { likes: likesCount } });
    } catch (error) {
        console.error("Error al contar likes:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});


export default likeRouter;
