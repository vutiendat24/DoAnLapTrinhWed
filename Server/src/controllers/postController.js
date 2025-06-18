import Post from '../models/postModel.js';
import Users from '../models/userModel.js';


const createPost = async (req, res) => {
  try {
    const { author, text, privacy, location, device, source } = req.body;
    const files = req.files;

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
    const media = files.map((file) => {
      const fileType = file.mimetype.startsWith('video') ? 'video' : 'image';
      return {
        url: `/uploads/${file.filename}`, // hoặc `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        type: fileType,
      };
    });

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

export { createPost, getAllPostById, toggleLikeByUser};
