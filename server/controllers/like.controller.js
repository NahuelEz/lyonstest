import Like from "../models/Like.js";
import Publication from "../models/Publication.js";

class LikeController {
    // Alternar Like
    likePublication = async (req, res) => {
        try {
            const { id: publicationId } = req.params; // ID de la publicación
            const { id: userId } = req.user; // ID del usuario autenticado

            // Verificar si la publicación existe
            const publicationExists = await Publication.findByPk(publicationId);
            if (!publicationExists) {
                return res.status(400).json({
                    success: false,
                    message: "La publicación no existe.",
                });
            }

            // Verificar si ya existe un "like"
            const existingLike = await Like.findOne({ where: { userId, publicationId } });

            if (existingLike) {
                // Si ya dio "like", eliminarlo (quitar "Me gusta")
                await Like.destroy({ where: { userId, publicationId } });

                // Contar los "likes" restantes
                const likesCount = await Like.count({ where: { publicationId } });

                return res.status(200).json({
                    success: true,
                    message: "Like eliminado.",
                    body: { likes: likesCount },
                });
            }

            // Si no dio "like", agregarlo (dar "Me gusta")
            await Like.create({ userId, publicationId });

            // Contar los "likes" actualizados
            const likesCount = await Like.count({ where: { publicationId } });

            res.status(201).json({
                success: true,
                message: "Like agregado.",
                body: { likes: likesCount },
            });
        } catch (error) {
            console.error("Error al alternar like:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor.",
            });
        }
    };
}

export default new LikeController();
