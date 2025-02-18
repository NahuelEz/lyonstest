import Comment from "../models/Comment.js";

class CommentController {
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
