const express = require('express');
const router = express.Router();
const { createPost, getAllPostById } = require('../controllers/postController');
const multer = require('multer')
const path = require("path")
// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  },
});

const upload = multer({ storage });

router.post("/create", upload.array('media'), createPost);
router.get("/author/:authorId", getAllPostById);
router.put("/:postId/like", getAllPostById);

module.exports = router;