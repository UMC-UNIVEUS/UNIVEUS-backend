import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';
import uuid4 from 'uuid4';
import {baseResponse, errResponse} from "./response";
dotenv.config();

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();


const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.webp'];

export const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'univeus-bucket1',
        key: (req, file, callback) => {
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error('wrong extension'));
            }
            callback(null, `${Date.now()}_${uuid4()}${extension}`);
        },
        acl: 'public-read-write',
    }),
    limits: { fileSize: 10 * 1024 * 1024 },  //10MB로 제한
});

export const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.send(errResponse(baseResponse.UPLOADED_FILE_SIZE_EXCEED_LIMIT));
        }
    }
    next(err);
};
