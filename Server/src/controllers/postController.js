import Post from '../models/postModel.js';
import Users from '../models/userModel.js';
import upload from '../middleware/multer.js';
import express from 'express';

const createPost = async (req, res) => {
  try {
    const { author, text, privacy, location, device, source } = req.body;

    const files = req.files;
    console.log("sss")
    console.log(files)

    if (!author) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc: author',
      });
    }

    const user = await Users.findById(author);
    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng với author đã cung cấp.',
      });
    }
    // Xử lý media từ files
    const media = files.map(file => ({
      url: `http://localhost:5000/uploads/${file.filename}`, // URL ảnh cho client
      type: file.mimetype.startsWith('image/') ? 'image' : 'other',
    }));


    // Tạo post mới
    const newPost = new Post({
      author,
      text,
      media,
      privacy: privacy || 'friends',
      meta: {
        location: location || '',
        device: device || '',
        source: source || 'direct',
      },
    });

    const savedPost = await newPost.save();

    // Populate author
    const populatedPost = await savedPost.populate('author', 'username profile.fullName');

    res.status(201).json({
      message: 'Tạo bài viết thành công!',
      post: populatedPost,
    });
  } catch (err) {
    console.error('Lỗi tạo bài viết:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

const getAllPostById = async (req, res) => {
 try {
    const { authorId } = req.params;
    console.log(authorId)

    // Kiểm tra xem authorId có được truyền vào không
    if (!authorId) {
      return res.status(400).json({ message: "Thiếu authorId trong yêu cầu." });
    }

    // Tìm tất cả bài viết có author trùng với authorId
    // const posts = await Post.find({ author: authorId }).populate('author', 'username profile.fullName');
    const posts = await Post.find().populate('author', 'username profile.fullName');

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết nào cho người dùng này." });
    }

    res.status(200).json({
      message: "Lấy bài viết thành công!",
      posts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
const getAllPostByUserId = async (req, res) => {
 try {
    const { authorId } = req.params;
    console.log(authorId)

    // Kiểm tra xem authorId có được truyền vào không
    if (!authorId) {
      return res.status(400).json({ message: "Thiếu authorId trong yêu cầu." });
    }

    // Tìm tất cả bài viết có author trùng với authorId
    // const posts = await Post.find({ author: authorId }).populate('author', 'username profile.fullName');
    const posts = await Post.find({ author: authorId }).populate('author', 'username profile.fullName');

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết nào cho người dùng này." });
    }

    res.status(200).json({
      message: "Lấy bài viết thành công!",
      posts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

const toggleLikeByUser = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  console.log(post);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const { action } = req.body;

  if (action === "like") post.interactions.likes += 1;
  else if (action === "unlike" && post.interactions.likes > 0) post.interactions.likes -= 1;

  await post.save();
  res.status(200).json({ likes: post.interactions.likes });
};
const createComment = async(req, res) => {
  const {postId} = req.params;
  const {userId, content} = req.body
  if(!userId){
    return res.status(400).json({message: "thieu userId"})
  }
  else if(!content){
    return res.status(400).json({message: "thieu noi dung binh luan"})
  }
  try{
    const post = await Post.findById(postId)
    if(!postId) return res.status(404).json({message: "khong tim thay bai viet"})
      const newComment ={
        user: userId,
        content,
        createAt: new Date(),
      }

    post.interactions.comments.push(newComment)

    await post.save();
    
    const addedComment = post.interactions.comments[post.interactions.comments.length - 1];

    return res.status(200).json({ message: "Đã thêm bình luận", comment: addedComment });
  }
  catch (err){
    return res.status(500).json({message: "Loi server", error: error.message});
  }
}

const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('interactions.comments.user', 'name email'); // populate user nếu cần

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ comments: post.interactions.comments });

  
  } catch (error) {
    console.error('Error getting comments:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy bình luận' });
  }
};
export { createPost, getAllPostById, toggleLikeByUser, createComment, getComments, getAllPostByUserId};
