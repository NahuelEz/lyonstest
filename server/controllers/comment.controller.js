import Comment from "../models/Comment.js";

class CommentController {
    // Agregar un comentario
    addComment = async (req, res) => {
        try {
            const { id: publicationId } = req.params;
            const { id: userId } = req.user;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ success: false, message: "El comentario no puede estar vacío" });
            }

            const comment = await Comment.create({ userId, publicationId, content });

            res.status(201).json({ success: true, message: "Comentario agregado", body: comment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    // Obtener comentarios de una publicación
    getComments = async (req, res) => {
        try {
            const { id: publicationId } = req.params;

            const comments = await Comment.findAll({ where: { publicationId }, order: [["createdAt", "DESC"]] });

            res.status(200).json({ success: true, body: comments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

export default new CommentController();
