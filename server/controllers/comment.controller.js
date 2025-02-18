import { Comment, User, Profile } from "../models/index.js";

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
                        attributes: ['id'],
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

            console.log('Comments found:', JSON.stringify(comments, null, 2));

            res.status(200).json({ success: true, body: comments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    // Agregar un comentario
    addComment = async (req, res) => {
        try {
            const { id: publicationId } = req.params;
            const { id: userId } = req.user;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ success: false, message: "El comentario no puede estar vacío." });
            }

            const newComment = await Comment.create({
                publicationId,
                userId,
                content,
            });

            // Obtener el comentario con la información del usuario
            const commentWithUser = await Comment.findOne({
                where: { id: newComment.id },
                include: [
                    {
                        model: User,
                        attributes: ['id'],
                        include: [
                            {
                                model: Profile,
                                attributes: ['profileImage', 'stageName']
                            }
                        ]
                    }
                ]
            });

            console.log('New comment created:', JSON.stringify(commentWithUser, null, 2));
            res.status(201).json({ success: true, body: commentWithUser });
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

export default new CommentController();
