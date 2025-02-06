import { Router } from "express";
import userRouter from "./user.router.js";
import profileRouter from "./profile.router.js";
import publicationRouter from "./publication.router.js";
import publicRouter from "./public.router.js";
import subscriptionRouter from "./subscription.router.js";
import contentRouter from "./content.router.js";

const router = Router();

router.use("/users", userRouter);
router.use("/publications", publicationRouter);
router.use("/profiles", profileRouter);
router.use("/public", publicRouter);
router.use("/subscriptions", subscriptionRouter);
router.use("/contents", contentRouter);

export default router;