import { Router } from "express";
import LikeController from "../controllers/like.controller.js";
import { validateUser } from "../middlewares/user.validator.js"; 
const likeRouter = Router();

likeRouter.post("/:id/like", validateUser, LikeController.likePublication);
likeRouter.delete("/:id/unlike", validateUser, LikeController.unlikePublication);

export default likeRouter;
