import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

class CommentController {
    // Obtener comentarios de una publicación
    getComments = async (req, res) => {
        try {
            const { id: publicationId } = req.params;
            const comments = await Comment.findAll({
                where: { publicationId },
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: Profile,
                                attributes: ['profileImage', 'stageName']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({ success: true, body: comments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    // Agregar un comentario
    addComment = async (req, res) => {
        try {
            const { id: publicationId } = req.params;
            const { id: userId } = req.user; // `req.user` debería estar definido por el middleware de autenticación
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ success: false, message: "El comentario no puede estar vacío." });
            }

            const newComment = await Comment.create({
                publicationId,
                userId,
                content,
            });

            res.status(201).json({ success: true, body: newComment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

export default new CommentController();
