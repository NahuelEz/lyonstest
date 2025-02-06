import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');

        if (!isImage && !isVideo) {
            throw new Error('Invalid file type. Only images and videos are allowed.');
        }

        let folder = 'uploads';
        if (req.path.startsWith('/api/profiles')) {
            folder = 'profiles/documentation';
        } else if (req.path.startsWith('/api/publications')) {
            folder = isImage ? 'publications/images' : 'publications/videos';
        }

        return {
            folder,
            resource_type: isImage ? 'image' : 'video',
            allowed_formats: isImage
                ? ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf']
                : ['mp4', 'webm', 'mov'],
        };
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/webm', 'video/quicktime',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only supported image/video formats are allowed.'));
        }
        cb(null, true);
    },
});

export default upload;
