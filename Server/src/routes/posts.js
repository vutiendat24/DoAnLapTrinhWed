import express from 'express';
import { createPost, getAllPostById } from '../controllers/postController.js';
import multer from 'multer';
import path from 'path';
import upload from '../middleware/multer.js';
const router = express.Router();

// Cấu hình lưu trữ
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // thư mục lưu ảnh
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + '-' + file.fieldname + ext);
//   },
// });


router.post("/create", upload.array('media'), createPost);
router.get("/author/:authorId", getAllPostById);
router.put("/:postId/like", getAllPostById);

export default router;